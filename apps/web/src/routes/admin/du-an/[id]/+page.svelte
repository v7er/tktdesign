<script lang="ts">
	import ProjectForm from '#lib/components/ProjectForm.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Sửa dự án</h1>
<ProjectForm project={data.project} />
