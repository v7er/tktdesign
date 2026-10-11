<script lang="ts">
	import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right';
	import IconClock from '@tabler/icons-svelte-runes/icons/clock';
	import IconMail from '@tabler/icons-svelte-runes/icons/mail';
	import IconMapPin from '@tabler/icons-svelte-runes/icons/map-pin';
	import IconPhone from '@tabler/icons-svelte-runes/icons/phone';
	import { site } from '#lib/site';

	const stroke = 1.3;
</script>

<footer class="site-footer">
	<div class="wrap footer-grid">
		<div>
			<strong>{site.name}</strong>
			<p class="muted">{site.tagline}</p>
		</div>
		<div>
			<div class="foot-row"><IconPhone size={16} {stroke} /> {site.phone}</div>
			<div class="foot-row"><IconMail size={16} {stroke} /> {site.email}</div>
			<div class="foot-row"><IconClock size={16} {stroke} /> {site.hours}</div>
		</div>
		<div>
			<div class="foot-row"><IconMapPin size={16} {stroke} /> {site.address}</div>
			<a href="/lien-he">
				Gửi yêu cầu tư vấn
				<IconArrowUpRight size={16} {stroke} style="vertical-align: -3px" />
			</a>
		</div>
	</div>
</footer>
