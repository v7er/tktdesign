<script lang="ts">
	import { goto } from '$app/navigation';
	import { api, ApiError } from '#lib/api';
	import { categories } from '#lib/site';
	import type { Project } from '#lib/types';

	let { project = null }: { project?: Project | null } = $props();

	let title = $state(project?.title ?? '');
	let summary = $state(project?.summary ?? '');
	let description = $state(project?.description ?? '');
	let location = $state(project?.location ?? '');
	let year = $state(project?.year?.toString() ?? '');
	let category = $state(project?.category ?? 'nha-pho');
	let land_width_m = $state(project?.land_width_m?.toString() ?? '');
	let land_depth_m = $state(project?.land_depth_m?.toString() ?? '');
	let floor_area_m2 = $state(project?.floor_area_m2?.toString() ?? '');
	let floors = $state(project?.floors?.toString() ?? '');
	let functions = $state(project?.functions ?? '');
	let featured = $state(project?.featured ?? false);
	let status = $state(project?.status ?? 'draft');
	let error = $state('');
	let pending = $state(false);
	let uploading = $state(false);
	let current = $state(project);

	function payload() {
		return {
			title,
			summary,
			description,
			location,
			year: year ? Number(year) : null,
			category,
			land_width_m: land_width_m ? Number(land_width_m) : null,
			land_depth_m: land_depth_m ? Number(land_depth_m) : null,
			floor_area_m2: floor_area_m2 ? Number(floor_area_m2) : null,
			floors: floors ? Number(floors) : null,
			functions,
			featured,
			status
		};
	}

	async function save(e: Event) {
		e.preventDefault();
		error = '';
		pending = true;
		try {
			if (current) {
				const res = await api<{ project: Project }>(`/api/admin/projects/${current.id}`, {
					method: 'PUT',
					body: JSON.stringify(payload())
				});
				current = res.project;
			} else {
				const res = await api<{ project: Project }>('/api/admin/projects', {
					method: 'POST',
					body: JSON.stringify(payload())
				});
				await goto(`/admin/du-an/${res.project.id}`);
			}
		} catch (err) {
			error = err instanceof ApiError ? err.message : 'Không lưu được.';
		} finally {
			pending = false;
		}
	}

	async function upload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file || !current) return;
		uploading = true;
		error = '';
		try {
			const form = new FormData();
			form.set('file', file);
			if (!current.cover_key) form.set('cover', '1');
			const res = await api<{ project: Project }>(`/api/admin/projects/${current.id}/images`, {
				method: 'POST',
				body: form
			});
			current = res.project;
		} catch (err) {
			error = err instanceof ApiError ? err.message : 'Không tải ảnh được.';
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	async function removeImage(id: string) {
		if (!current) return;
		const res = await api<{ project: Project }>(`/api/admin/projects/${current.id}/images/${id}`, {
			method: 'DELETE'
		});
		current = res.project;
	}

	async function destroy() {
		if (!current) return;
		if (!confirm('Xóa dự án này?')) return;
		await api(`/api/admin/projects/${current.id}`, { method: 'DELETE' });
		await goto('/admin/du-an');
	}
</script>

<form class="form-grid" onsubmit={save}>
	<label class="full">Tên dự án<input bind:value={title} required /></label>
	<label>Địa điểm<input bind:value={location} /></label>
	<label>Năm<input bind:value={year} inputmode="numeric" /></label>
	<label>
		Loại
		<select bind:value={category}>
			{#each Object.entries(categories) as [id, label]}
				<option value={id}>{label}</option>
			{/each}
		</select>
	</label>
	<label>
		Trạng thái
		<select bind:value={status}>
			<option value="draft">Nháp</option>
			<option value="published">Công khai</option>
		</select>
	</label>
	<label>Ngang (m)<input bind:value={land_width_m} /></label>
	<label>Dài (m)<input bind:value={land_depth_m} /></label>
	<label>Sàn (m²)<input bind:value={floor_area_m2} /></label>
	<label>Số tầng<input bind:value={floors} /></label>
	<label class="full">Tóm tắt<textarea bind:value={summary}></textarea></label>
	<label class="full">Mô tả<textarea bind:value={description}></textarea></label>
	<label class="full">Công năng từng tầng<textarea bind:value={functions}></textarea></label>
	<label><input type="checkbox" bind:checked={featured} /> Nổi bật trên trang chủ</label>
	{#if error}<p class="error full">{error}</p>{/if}
	<div class="full">
		<button class="btn" type="submit" disabled={pending}>{pending ? 'Đang lưu…' : 'Lưu'}</button>
		{#if current}
			<button class="btn ghost" type="button" onclick={destroy}>Xóa</button>
		{/if}
	</div>
</form>

{#if current}
	<h2 style="margin-top:2rem">Ảnh</h2>
	<p class="muted">JPEG / PNG / WebP, tối đa 8MB. Ảnh đầu tiên làm ảnh bìa nếu chưa có bìa.</p>
	<div class="gallery-admin">
		{#each current.images as img}
			<figure>
				<img src={img.url} alt="" />
				<button class="btn ghost" type="button" onclick={() => removeImage(img.id)}>Xóa</button>
			</figure>
		{/each}
	</div>
	<label>
		Thêm ảnh
		<input type="file" accept="image/jpeg,image/png,image/webp" onchange={upload} disabled={uploading} />
	</label>
{/if}
