import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { addNode } from "../services/add-node";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AddNode: FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [parentId, setParentId] = useState("root");
  const [nodeName, setNodeName] = useState("");

  const addNodeMutation = useMutation({
    mutationFn: addNode,
    onSuccess: () => {
      // Refetch children of the parent node
      queryClient.invalidateQueries({ queryKey: ["nodes", parentId] });
      // Clear input field
      setNodeName("");
      // Close Dialog
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>Add node</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={nodeName}
              placeholder="Node name"
              className="col-span-3"
              onChange={(e) => setNodeName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            {/* TODO: dropdown with parent selection */}
            <Label htmlFor="parentId" className="text-right">
              Parent ID
            </Label>
            <Input
              id="parentId"
              value={parentId}
              placeholder="Parent id"
              className="col-span-3"
              onChange={(e) => setParentId(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={nodeName.length === 0}
            onClick={() =>
              addNodeMutation.mutate({
                name: nodeName,
                parentId: parentId,
              })
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddNode };
