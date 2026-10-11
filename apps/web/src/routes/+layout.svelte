<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import { site } from '#lib/site';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	<title>{site.name} — {site.tagline}</title>
	<meta name="description" content="TKT Design tư vấn, thiết kế và thi công nhà phố Việt Nam. Công năng sử dụng đặt lên trước." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
{/if}
