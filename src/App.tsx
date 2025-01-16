import {useState} from 'react';
import './App.css';
import {useUserActions} from './store/users/userAction.ts';
import {useSelector} from 'react-redux';
import {selectUserSlice} from './store/users/userSlice.ts';
import axios from 'axios';
import logo from '../public/img/novo.png';

function App() {
    const userDetails = useSelector(selectUserSlice);
    const [selectedAnswers, setSelectedAnswers] = useState<any>({});
    const {userLogin} = useUserActions();
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({name: '', dob: ''});
    const [loading, setLoading] = useState<boolean>(false);

    const questions = [
        {
            _id: '6788ee070becfa6808fe4574',
            question: 'Please select one from the Nominees for the Customer champion Award ?',
            options: ['Hassan', 'Bilal', 'Sevinc', 'Alice'],
            answer: 'Sevinc',
        },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setSelectedAnswers((prev: any) => ({...prev, [questionId]: answer}));
    };

    const handleSubmit = () => {
        if (step === 1) {
            userLogin({initials: formData.name, dateOfBirth: formData.dob});
            setStep(2);
        } else if (step === 2) {
            submitQuiz();
            // setStep(3);
        }
    };

    const submitQuiz = async () => {
        setLoading(true);
        try {
            const payload = {
                userId: userDetails.user?._id,
                answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
                    questionId,
                    answer,
                })),
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
        <>
            {/* Navbar */}
            <nav className="bg-gray-100  p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
                    <div className="flex items-center">
                        <img src={logo} alt="logo" className="h-14 object-contain mr-2"/>
                        {/*<span className="text-xl font-semibold">Survey</span>*/}
                    </div>
                    {/*<div className="space-x-4">*/}
                    {/*    <a href="/" className="hover:text-gray-200">Home</a>*/}
                    {/*    <a href="#quiz" className="hover:text-gray-200">Quiz</a>*/}
                    {/*</div>*/}
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-20 ">
                <p className={"text-xl font-semibold text-4xl mb-20"}>Recognizing colleagues with Exceptional Achievements</p>
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg -mt-10">
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-semibold text-center mb-4">Enter Your Details</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!formData.name || !formData.dob}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                                >
                                    Start Quiz
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-semibold text-center mb-4">Answer the Questions</h2>
                            {questions.map((q) => (
                                <div key={q._id} className="mb-4">
                                    <p className="text-gray-700 font-medium mb-2">{q.question}</p>
                                    <div className="space-y-2">
                                        {q.options.map((option) => (
                                            <label
                                                key={option}
                                                className={`block p-2 border rounded-md cursor-pointer ${
                                                    selectedAnswers[q._id] === option
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100'
                                                }`}
                                                onClick={() => handleAnswerChange(q._id, option)}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${q._id}`}
                                                    value={option}
                                                    checked={selectedAnswers[q._id] === option}
                                                    onChange={() => handleAnswerChange(q._id, option)}
                                                    className="hidden"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={submitQuiz}
                                disabled={Object.keys(selectedAnswers).length !== questions.length}
                                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300"
                            >
                                {loading ? 'Loading...' : 'Submit'}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                            <p className="text-gray-700">
                                Thank you for participating, {formData.name}!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
