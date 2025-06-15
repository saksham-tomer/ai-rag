import ChatView from "@/components/Chat/ChatView";
import Image from "next/image";

const props = {
  title: "How the model determines token",
  model: "GPT-4"
}

export default function Page() {
  return (
    <ChatView props={props} />
  )
}