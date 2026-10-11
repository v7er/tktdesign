<script lang="ts">
	import type { Component } from 'svelte';
	import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right';
	import IconCompass from '@tabler/icons-svelte-runes/icons/compass';
	import IconCrane from '@tabler/icons-svelte-runes/icons/crane';
	import IconHammer from '@tabler/icons-svelte-runes/icons/hammer';
	import IconLayoutBoard from '@tabler/icons-svelte-runes/icons/layout-board';
	import IconMessages from '@tabler/icons-svelte-runes/icons/messages';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconRulerMeasure from '@tabler/icons-svelte-runes/icons/ruler-measure';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import { site } from '#lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const stroke = 1.25;

	const services: { num: string; title: string; body: string; icon: Component }[] = [
		{
			num: '01',
			title: 'Tư vấn',
			body: 'Xem đất, chỉ giới, hướng nắng, lối xe. Chốt ai ở tầng nào, để xe mấy chỗ, bếp ướt hay khô — trước khi vẽ.',
			icon: IconMessages
		},
		{
			num: '02',
			title: 'Thiết kế',
			body: 'Mặt bằng nhà phố, kết cấu, điện nước. Bản vẽ để thi công được, không phải bản vẽ để treo.',
			icon: IconCompass
		},
		{
			num: '03',
			title: 'Thi công',
			body: 'Triển khai trên công trường, chốt vật liệu theo công năng (chống ẩm, chống trượt, dễ lau) rồi mới đến hoàn thiện.',
			icon: IconCrane
		}
	];

	const steps: { num: string; title: string; body: string; icon: Component }[] = [
		{
			num: '01',
			title: 'Khảo sát đất',
			body: 'Đo lô, xem hẻm, nắng, hàng xóm, cấp thoát nước.',
			icon: IconRulerMeasure
		},
		{
			num: '02',
			title: 'Chốt công năng',
			body: 'Danh sách phòng theo người ở thật, không theo “mẫu 4 tầng”.',
			icon: IconLayoutBoard
		},
		{
			num: '03',
			title: 'Thiết kế',
			body: 'Mặt bằng → mặt đứng → dự toán. Sửa trên giấy, không sửa trên tường.',
			icon: IconPencil
		},
		{
			num: '04',
			title: 'Thi công',
			body: 'Giám sát kết cấu, chống thấm, hoàn thiện. Bàn giao đúng công năng đã chốt.',
			icon: IconHammer
		}
	];
</script>

<svelte:head>
	<title>{site.name} — Thiết kế và thi công nhà phố</title>
</svelte:head>

<section class="hero">
	<img src="/hero.jpg" alt="Dãy nhà phố Việt Nam" />
	<div class="hero-copy">
		<p class="kicker">{site.tagline}</p>
		<h1>{site.headline}</h1>
		<p>Chúng tôi làm nhà để ở: để xe, nấu ăn, ngủ, thờ, phơi — rõ từng tầng trước khi vẽ mặt đứng.</p>
		<a class="btn" href="/lien-he">
			Nhờ TKT xem đất
			<IconArrowUpRight size={18} {stroke} />
		</a>
	</div>
</section>

<section class="section">
	<div class="wrap">
		<div class="section-head">
			<div>
				<p class="muted">Làm gì</p>
				<h2>Ba việc, một nhà</h2>
			</div>
		</div>
		<div class="grid-3">
			{#each services as s (s.num)}
				{@const Icon = s.icon}
				<article class="service">
					<div class="service-head">
						<span class="icon-mark"><Icon size={22} {stroke} /></span>
						<span class="num">{s.num}</span>
					</div>
					<h3>{s.title}</h3>
					<p class="muted">{s.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section alt">
	<div class="wrap">
		<div class="section-head">
			<div>
				<p class="muted">Dự án</p>
				<h2>Nhà đã làm</h2>
			</div>
			<a href="/du-an">
				Xem tất cả
				<IconArrowUpRight size={16} {stroke} style="vertical-align: -3px" />
			</a>
		</div>
		{#if data.featured.length}
			<div class="grid-projects">
				{#each data.featured as project}
					<ProjectCard {project} />
				{/each}
			</div>
		{:else}
			<p class="muted">Đang cập nhật dự án.</p>
		{/if}
	</div>
</section>

<section class="section">
	<div class="wrap">
		<div class="section-head">
			<div>
				<p class="muted">Cách làm</p>
				<h2>Bốn bước, không vòng vo</h2>
			</div>
		</div>
		<div class="steps">
			{#each steps as s (s.num)}
				{@const Icon = s.icon}
				<article class="step">
					<div class="step-index">
						<span class="dot">{s.num}</span>
						<span class="rail"></span>
					</div>
					<span class="icon-mark"><Icon size={24} {stroke} /></span>
					<h3>{s.title}</h3>
					<p class="muted">{s.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
