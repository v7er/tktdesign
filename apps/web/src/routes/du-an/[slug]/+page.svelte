<script lang="ts">
	import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right';
	import IconCalendar from '@tabler/icons-svelte-runes/icons/calendar';
	import IconDimensions from '@tabler/icons-svelte-runes/icons/dimensions';
	import IconMapPin from '@tabler/icons-svelte-runes/icons/map-pin';
	import IconRulerMeasure from '@tabler/icons-svelte-runes/icons/ruler-measure';
	import IconStairs from '@tabler/icons-svelte-runes/icons/stairs';
	import { formatArea, formatPlot } from '#lib/format';
	import { categories, site } from '#lib/site';
	import type { PageProps } from './$types';

	const stroke = 1.3;

	let { data }: PageProps = $props();
	const p = $derived(data.project);
</script>

<svelte:head>
	<title>{p.title} — {site.name}</title>
	<meta name="description" content={p.summary} />
</svelte:head>

<section class="section">
	<div class="wrap detail-grid">
		<div>
			<img
				class="cover"
				src={p.cover_url ?? `/covers/${p.id}.jpg`}
				alt={p.title}
				onerror={(e) => {
					const el = e.currentTarget as HTMLImageElement;
					if (el.dataset.fb) return;
					el.dataset.fb = '1';
					el.src = `/covers/${p.id}.jpg`;
				}}
			/>
			{#if p.images.length > 1}
				<div class="gallery-admin" style="margin-top: 0.8rem">
					{#each p.images as img}
						<img src={img.url} alt={img.alt || p.title} />
					{/each}
				</div>
			{/if}
			<h1 style="margin-top: 1.4rem">{p.title}</h1>
			<p>{p.summary}</p>
			<div class="functions">{p.description}</div>
		</div>
		<aside>
			<p class="muted">{categories[p.category] ?? p.category}</p>
			<ul class="facts">
				<li>
					<span class="fact-label"><IconMapPin size={16} {stroke} /> Địa điểm</span><b>{p.location || '—'}</b>
				</li>
				<li>
					<span class="fact-label"><IconCalendar size={16} {stroke} /> Năm</span><b>{p.year ?? '—'}</b>
				</li>
				<li>
					<span class="fact-label"><IconRulerMeasure size={16} {stroke} /> Đất</span
					><b>{formatPlot(p.land_width_m, p.land_depth_m)}</b>
				</li>
				<li>
					<span class="fact-label"><IconDimensions size={16} {stroke} /> Sàn</span><b>{formatArea(p.floor_area_m2)}</b>
				</li>
				<li>
					<span class="fact-label"><IconStairs size={16} {stroke} /> Số tầng</span><b>{p.floors ?? '—'}</b>
				</li>
			</ul>
			<h3 style="margin-top: 1.6rem">Công năng</h3>
			<p class="functions">{p.functions}</p>
			<a class="btn" href="/lien-he">
				Nhờ tư vấn lô tương tự
				<IconArrowUpRight size={16} {stroke} />
			</a>
		</aside>
	</div>
</section>
