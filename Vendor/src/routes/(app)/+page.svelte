<script lang="ts">
	import { Button, Dropdown, DropdownItem, Search } from 'flowbite-svelte';
	import { ChevronDownOutline, SearchOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';

	const items = [
		{
			label: 'Event Planning and Coordination'
		},
		{
			label: 'Decor and Designs'
		},
		{
			label: 'Catering and Culinary'
		},
		{
			label: 'Fashion and Beauty'
		},
		{
			label: 'Photography and Videography'
		},
		{
			label: 'Music and Entertainment'
		}
	];

	let selectCategory = 'All categories';

	let search = '';

	const performSearch = () => {
		search = search.trim();
		if (search === '') {
			toast.error('Please enter a search term');
			return;
		}

		// go to search page
		window.location.href = `/gallery?search=${search}`;
	};
</script>

<Toaster />
<div
	class="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-[url('https://unsplash.com/photos/30UOqDM5QW0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHdlZGRpbmd8ZW58MHwwfHx8MTcwOTk5OTE0NHww&force=true&w=1920')] bg-cover p-4"
>
	<form class="mx-4 flex w-full max-w-xl">
		<div class="relative">
			<Button class="whitespace-nowrap rounded-e-none border border-e-0 border-primary-700">
				{selectCategory}
				<ChevronDownOutline class="ms-2.5 h-2.5 w-2.5" />
			</Button>
			<Dropdown classContainer="w-40">
				{#each items as { label }}
					<DropdownItem
						on:click={() => {
							selectCategory = label;
						}}
						class={selectCategory === label ? 'underline' : ''}
					>
						{label}
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
		<Search
			size="md"
			class="rounded-none py-2.5"
			placeholder="Search Mockups, Logos, Design Templates..."
			bind:value={search}
		/>
		<Button class="rounded-s-none !p-2.5" on:click={performSearch}>
			<SearchOutline class="h-5 w-5" />
		</Button>
	</form>
	<div class="mx-4 w-full max-w-xl bg-primary-900 p-16 text-center opacity-75">
		<h2 class="cursive text-2xl font-bold text-white md:text-6xl">
			Where Dreams<br />Come Unfold And<br />Promises Come To Life
		</h2>
	</div>
</div>
