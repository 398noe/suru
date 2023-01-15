import "regenerator-runtime";
import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { MdOutlineMic } from "react-icons/md";

export default function Index() {
	const { transcript, finalTranscript, listening, resetTranscript } = useSpeechRecognition();

	const [isAborted, setIsAborted] = useState<boolean>(false);
	const [answer, setAnswer] = useState<string>("");

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

	const askAI = async (question: string): Promise<string | undefined> => {
		try {
			const response = await fetch("/api/test", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					payload: question
				})
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw data.error || new Error(`Request failed with status ${response.status}`);
			}
			return data.answer as Promise<string>;
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const exec = async () => {
			// 読み上げ開始
			if (finalTranscript !== "") {
				// リクエスト開始
				const question = finalTranscript;
				const responseAnswer = await askAI(question);
				if (responseAnswer !== undefined) {
					setAnswer(responseAnswer);
				}
				// リクエストが終了次第読み上げ開始されるはず
				console.log("===読み上げ開始===");
				console.log(responseAnswer);
				// 読み上げたい文章
				const readTranscript = responseAnswer;


				if (readTranscript !== undefined) {
					const message = new SpeechSynthesisUtterance();
					message.text = readTranscript;
					message.lang = "ja_JP";
					speechSynthesis.speak(message);

					console.log("===読み上げ完了===")
				}
			}
		}
		exec();
	}, [finalTranscript]);

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center gap-4 p-4">
			<div className="flex justify-center items-center gap-2">
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
			{
				answer ? (
					<div className="flex justify-center items-center p-4">
						<div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
							<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Suru😎</h5>
							<div className="border my-2"></div>
							<p className="font-normal text-gray-700 dark:text-gray-400">
								{answer}
							</p>
						</div>
					</div>
				) : (
					<></>
				)
			}
		</div>
	)
}
