<script lang="ts">
	import IconMenu2 from '@tabler/icons-svelte-runes/icons/menu-2';
	import IconX from '@tabler/icons-svelte-runes/icons/x';
	import { page } from '$app/state';
	import { nav, site } from '#lib/site';

	let open = $state(false);

	function current(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<header class="site-header">
	<div class="wrap header-inner">
		<a class="logo" href="/" onclick={() => (open = false)}>
			<strong>{site.name}</strong>
			<span>Kiến trúc · Xây dựng</span>
		</a>
		<button
			class="menu-btn"
			type="button"
			onclick={() => (open = !open)}
			aria-expanded={open}
			aria-label={open ? 'Đóng mục lục' : 'Mở mục lục'}
		>
			{#if open}
				<IconX size={20} stroke={1.4} />
			{:else}
				<IconMenu2 size={20} stroke={1.4} />
			{/if}
		</button>
		<nav class="main" class:open>
			{#each nav as item}
				<a
					href={item.href}
					aria-current={current(item.href) ? 'page' : undefined}
					onclick={() => (open = false)}>{item.label}</a
				>
			{/each}
		</nav>
	</div>
</header>
