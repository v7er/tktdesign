<script lang="ts">
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import { categories, site } from '#lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filters = [
		{ id: '', label: 'Tất cả' },
		...Object.entries(categories).map(([id, label]) => ({ id, label }))
	];
</script>

<svelte:head>
	<title>Dự án — {site.name}</title>
</svelte:head>

<section class="section">
	<div class="wrap">
		<div class="section-head">
			<div>
				<p class="muted">Catalog</p>
				<h1>Nhà đã làm</h1>
				<p class="muted">Mỗi dự án ghi rõ đất, số tầng và công năng từng sàn.</p>
			</div>
		</div>
		<div class="filters">
			{#each filters as f}
				<a href={f.id ? `/du-an?loai=${f.id}` : '/du-an'} class:active={data.category === f.id}>
					{f.label}
				</a>
			{/each}
		</div>
		{#if data.projects.length}
			<div class="grid-projects">
				{#each data.projects as project}
					<ProjectCard {project} />
				{/each}
			</div>
		{:else}
			<p class="muted">Chưa có dự án trong mục này.</p>
		{/if}
	</div>
</section>
