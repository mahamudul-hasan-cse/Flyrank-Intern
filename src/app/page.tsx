export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        AI Research Workspace
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Chat with AI, organize your research into workspaces, and save the
        responses that matter.
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This is the application shell. Features will be added incrementally.
      </p>
    </section>
  );
}
