import { useState } from "react";
import { MdOutlineMic } from "react-icons/md";

export default function Index() {
	const [text, setText] = useState<string>("");

	
	
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
				<MdOutlineMic className="w-8 h-8"/>
				<span className="sr-only">Icon description</span>
			</div>
		</div>
	)
}
