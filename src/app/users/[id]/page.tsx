interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: Props) {
  const { id } = await params;

  return (
    <main style={{ padding: 20 }}>
      <h2>User Profile</h2>
      <p>User ID: {id}</p>
    </main>
  );
}
