<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { api } from '#lib/api';
	import { formatDate } from '#lib/format';
	import type { Inquiry } from '#lib/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const labels: Record<Inquiry['status'], string> = {
		new: 'Mới',
		read: 'Đã đọc',
		archived: 'Lưu trữ'
	};

	async function setStatus(id: string, status: Inquiry['status']) {
		await api(`/api/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
		await invalidateAll();
	}

	async function remove(id: string) {
		if (!confirm('Xóa liên hệ này?')) return;
		await api(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<h1>Hộp thư liên hệ</h1>

<table>
	<thead>
		<tr>
			<th>Thời gian</th>
			<th>Người gửi</th>
			<th>Nhu cầu</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.inquiries as item}
			<tr>
				<td>
					<div>{formatDate(item.created_at)}</div>
					<div class="muted">{labels[item.status]}</div>
				</td>
				<td>
					<b>{item.name}</b>
					<div>{item.phone}</div>
					<div class="muted">{item.email} {item.district} {item.land_area_m2 ? `· ${item.land_area_m2} m²` : ''}</div>
				</td>
				<td style="white-space: pre-wrap">{item.message}</td>
				<td>
					{#if item.status === 'new'}
						<button class="btn ghost" type="button" onclick={() => setStatus(item.id, 'read')}>Đã đọc</button>
					{/if}
					{#if item.status !== 'archived'}
						<button class="btn ghost" type="button" onclick={() => setStatus(item.id, 'archived')}>Lưu trữ</button>
					{/if}
					<button class="btn ghost" type="button" onclick={() => remove(item.id)}>Xóa</button>
				</td>
			</tr>
		{:else}
			<tr><td colspan="4">Chưa có liên hệ.</td></tr>
		{/each}
	</tbody>
</table>
