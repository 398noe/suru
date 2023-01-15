import "regenerator-runtime";
import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { MdOutlineMic } from "react-icons/md";

export default function Index() {
	const { transcript, finalTranscript, listening, resetTranscript } = useSpeechRecognition();

	const [isAborted, setIsAborted] = useState<boolean>(false);

	const recognition = () => {
		// 認識されたメッセージをリセット
		resetTranscript();
		// すでに認識中の場合は中断する
		if (listening) {
			SpeechRecognition.abortListening();
			// 中断した場合は読み上げない
			setIsAborted(true);
			console.log("===中断しました===")
		} else {
			// 認識を開始
			SpeechRecognition.startListening();
			setIsAborted(false);
		}
	}

	useEffect(() => {
		// 読み上げ開始
		if (finalTranscript !== "") {
			console.log("===読み上げ開始===");
			console.log(finalTranscript);
			// 読み上げたい文章
			const readTranscript = finalTranscript;
			
			const message = new SpeechSynthesisUtterance();
			message.text = readTranscript;
			message.lang = "ja_JP";
			speechSynthesis.speak(message);

			console.log("===読み上げ完了===")
		}
	}, [finalTranscript])

	return (
		<div className="h-screen w-screen flex justify-center items-center p-4">
			<div className="flex w-12 h-12">
				{
					listening ? (
						<div className="animate-ping absolute inline-flex w-12 h-12 rounded-full bg-pink-300 opacity-75"></div>
					) : (<></>)
				}
				<div
					className={`
							relative inline-flex w-full h-full rounded-full text-white
							${listening ? "bg-pink-700 hover:bg-pink-800" : "bg-blue-700 hover:bg-blue-800"}
							focus:ring-4 focus:outline-none focus:ring-blue-300
							font-medium text-sm p-2.5 text-center items-center
						`}
					onClick={recognition}
				>
					<MdOutlineMic className="w-8 h-8" />
					<span className="sr-only">Start Record</span>
				</div>
			</div>
			<p className="p-2">
				{
					listening ? (
						<span className="text-gray-500">{transcript}</span>
					) : (
						<span className="text-current">{finalTranscript}</span>
					)
				}
			</p>
		</div>
	)
}
