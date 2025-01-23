import {useSelector} from "react-redux";
import {selectUserLoading, selectUserSlice} from "../../store/users/userSlice.ts";
import React, {useEffect, useState} from "react";
import {useUserActions} from "../../store/users/userAction.ts";
import axios from "axios";
// import logo from "../../../public/img/novo.png";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import LoadingIcons from 'react-loading-icons'

type Answer = {
    questionId: string;
    answer: string;
};

function Home() {
    const userDetails = useSelector(selectUserSlice);
    const loginLoading = useSelector(selectUserLoading);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
    const {userLogin, getQuestions} = useUserActions();
    const [step, setStep] = useState<number>(1);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<any[]>([]);


    useEffect(() => {
        if (step === 2) {
            getQuestions().then((res: any) => {
                setQuestions(res || []);
            });
        }
    }, [step]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAnswerChange = (answer: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const updatedAnswers = [...selectedAnswers];
        const existingIndex = updatedAnswers.findIndex(
            (a) => a.questionId === currentQuestion._id
        );

        if (existingIndex !== -1) {
            updatedAnswers[existingIndex] = {questionId: currentQuestion._id, answer};
        } else {
            updatedAnswers.push({questionId: currentQuestion._id, answer});
        }

        setSelectedAnswers(updatedAnswers);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    console.log('loginLoading', loginLoading)
    const handleSubmit = async (): Promise<void> => {
        if (step === 1) {
            setUserLoading(true)
            const result = await userLogin({initials: name});
            if (result) {
                setUserLoading(false)
                setStep(2);
            }
        } else if (step === 2) {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setLoading(true);
        try {
            const payload = {
                userId: userDetails.user?._id,
                answers: selectedAnswers,
            };

            const response = await axios.post(
                'https://survey-app-production-84d8.up.railway.app/api/v1/users/quiz',
                payload
            );
            console.log('Quiz submitted successfully:', response.data);
            setStep(3);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={"flex min-h-screen bg-with-logo"}>
            <div className={"max-w-[700px] h-auto mx-auto flex justify-center items-center"}>
                {step === 1 && <Card className="w-[250px] sm:w-[350px]">
                    <CardHeader>
                        <CardTitle className={"text-lg text-blue-900 font-bold"}>Welcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5 items-start">
                                    <Label htmlFor="name" className={"text-blue-900"}>Initials</Label>
                                    <Input id="name" placeholder="Enter your initials"
                                           value={name}
                                           onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button className="w-full bg-blue-900"
                                onClick={handleSubmit}>{userLoading ? <LoadingIcons.Bars/> : 'Continue'}</Button>
                    </CardFooter>
                </Card>}

                {step === 2 && <Card className="sm:w-[670px]">
                    <CardHeader>
                        <CardTitle
                            className={"text-start  text-blue-900 text-lg font-bold "}>{questions[currentQuestionIndex]?.question}</CardTitle>
                    </CardHeader>


                    <CardContent>
                        <ul className="space-y-4">
                            {questions[currentQuestionIndex]?.options.map((option: string) => (
                                <li key={option} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={option}
                                        name="nominee"
                                        value={option}
                                        onChange={() => handleAnswerChange(option)}
                                        className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-300"
                                    />
                                    <label htmlFor={option}
                                           className="flex flex-row items-center gap-2 ml-3 text-blue-900 text-md font-bold ">
                                        <div className={"w-1.5 h-1.5 bg-blue-500 rounded"}/>
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        {currentQuestionIndex === questions.length - 1 && (
                            <CardFooter className="flex justify-between mt-6">
                                <Button className="w-full bg-blue-900" onClick={submitQuiz} disabled={loading}>
                                    {loading ? <LoadingIcons.Bars/> : 'Submit'}
                                </Button>
                            </CardFooter>
                        )}
                    </CardContent>
                </Card>}

                {step === 3 && <Card className=" sm:w-[350px]  ">
                    <CardHeader>
                        <CardTitle className={"text-blue-900 font-bold text-3xl"}>Thank You!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription
                            className={"font-medium text-lg"}>{`Thank you for participating, ${name}`}</CardDescription>
                    </CardContent>
                </Card>}
            </div>
        </section>
    );
}

export default Home;
