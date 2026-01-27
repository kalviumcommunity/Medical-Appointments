const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function UsersPage() {
  await wait(5000); // 5 sec delay

  return (
    <div>
      <h1>Users</h1>
      <ul>
        <li>User 1</li>
        <li>User 2</li>
        <li>User 3</li>
      </ul>
    </div>
  );
}
