import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { Node } from "../../interfaces/node";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface NodeSelect {
  onChange?: (value: string) => void;
}
const NodeSelect: FC<NodeSelect> = ({ onChange }) => {
  const queryClient = useQueryClient();

  // Access already fetched Nodes data
  const queriesData = queryClient.getQueriesData({ queryKey: ["nodes"] });
  const nodes: Node[] = [];

  if (queriesData.length > 0) {
    queriesData.forEach((queryData) => {
      if (queryData.length > 0) {
        const data = queryData[1] as { data: Node[] };
        nodes.push(...data.data);
      }
    });
  }

  return (
    <Select
      onValueChange={(value) => {
        if (onChange) onChange(value);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a parent" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="root">CEO</SelectItem>
          {nodes.map((node) => {
            return (
              <SelectItem key={node.id} value={node.id}>
                {node.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { NodeSelect };
