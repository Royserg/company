import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { generateBackgroundColor } from "../lib/bg-color-generator";
import { getNodeChildren } from "../services/get-node-children";

interface NodesProps {
  parentId: string;
}

const Nodes: FC<NodesProps> = ({ parentId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nodes", parentId],
    queryFn: () => getNodeChildren(parentId),
  });

  return (
    <div className="w-full pl-4">
      {isLoading && <div>Loading...</div>}

      {error && <div>Error occurred</div>}

      <ul className="w-full">
        {data?.data?.map((node) => {
          return (
            <li key={node.id} className="my-1 flex flex-col">
              <span
                className="w-max rounded-sm p-1"
                style={{
                  backgroundColor: generateBackgroundColor(node.height),
                }}
              >
                - {node.name}
              </span>
              <Nodes parentId={node.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { Nodes };
