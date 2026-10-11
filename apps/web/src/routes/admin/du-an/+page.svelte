<script lang="ts">
	import { categories } from '#lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem">
	<h1>Dự án</h1>
	<a class="btn" href="/admin/du-an/moi">Thêm dự án</a>
</div>

<table>
	<thead>
		<tr>
			<th></th>
			<th>Tên</th>
			<th>Loại</th>
			<th>Trạng thái</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.projects as p}
			<tr>
				<td>
					{#if p.cover_url}<img class="thumb" src={p.cover_url} alt="" />{/if}
				</td>
				<td>
					<b>{p.title}</b>
					<div class="muted">{p.location}</div>
				</td>
				<td>{categories[p.category] ?? p.category}</td>
				<td>{p.status === 'published' ? 'Công khai' : 'Nháp'}{p.featured ? ' · nổi bật' : ''}</td>
				<td><a href="/admin/du-an/{p.id}">Sửa</a></td>
			</tr>
		{:else}
			<tr><td colspan="5">Chưa có dự án.</td></tr>
		{/each}
	</tbody>
</table>
