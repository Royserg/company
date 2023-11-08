import { Nodes } from "./components/nodes";
import { Button } from "./components/ui/button";
import "./main.css";

export function App() {
  return (
    <main className="flex h-screen w-screen flex-col bg-slate-100 p-1">
      <nav className="container flex w-3/4 items-center justify-between rounded-xl border-2 bg-slate-200 p-1">
        <div></div>
        <h1 className="text-xl ">Company Structure</h1>
        <Button size={"sm"}>Add Node</Button>
      </nav>

      <div className="py-5"></div>

      <section className="container flex h-full w-3/4 flex-col">
        <div className="m-1 w-max rounded-sm border-2 border-black p-1 px-2 text-lg font-semibold">
          CEO
        </div>
        <Nodes parentId="root" />
      </section>
    </main>
  );
}

export default App;
