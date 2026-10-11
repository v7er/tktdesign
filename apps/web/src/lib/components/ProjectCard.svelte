<script lang="ts">
	import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right';
	import { formatArea, formatPlot } from '#lib/format';
	import { categories } from '#lib/site';
	import type { Project } from '#lib/types';

	let { project }: { project: Project } = $props();
</script>

<a class="project-card" href="/du-an/{project.slug}">
	<img
		src={project.cover_url ?? `/covers/${project.id}.jpg`}
		alt={project.title}
		onerror={(e) => {
			const el = e.currentTarget as HTMLImageElement;
			if (el.dataset.fb) return;
			el.dataset.fb = '1';
			el.src = `/covers/${project.id}.jpg`;
		}}
	/>
	<div class="meta">
		<div class="chips">
			<span>{categories[project.category] ?? project.category}</span>
			<span>{project.location}</span>
			{#if project.year}<span>{project.year}</span>{/if}
		</div>
		<h3>{project.title}</h3>
		<p class="muted">{project.summary}</p>
		<div class="chips">
			<span>Đất {formatPlot(project.land_width_m, project.land_depth_m)}</span>
			<span>Sàn {formatArea(project.floor_area_m2)}</span>
			{#if project.floors}<span>{project.floors} tầng</span>{/if}
		</div>
		<div class="card-go">Xem nhà <IconArrowUpRight size={15} stroke={1.3} /></div>
	</div>
</a>
