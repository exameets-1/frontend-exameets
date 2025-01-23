import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleAdmitCard, resetAdmitCardDetails } from '../store/slices/admitCardSlice';
import { useTheme } from '../App';

const AdmitCardDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { darkMode } = useTheme();

    const { admitCard, loading, error } = useSelector(
        (state) => state.admitCards
    );

    useEffect(() => {
        dispatch(fetchSingleAdmitCard(id));
        return () => {
            dispatch(resetAdmitCardDetails());
        };
    }, [dispatch, id]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    if (!admitCard) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/admitcards')}
                className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
                ← Back to Admit Cards
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className={`rounded-lg shadow-md p-6 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className={`text-3xl font-bold mb-4 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {admitCard.title}
                            </h1>
                            <div className="flex gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                    {admitCard.organization}
                                </span>
                            </div>
                        </div>

                        <hr className={`my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Description
                            </h3>
                            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                {admitCard.description}
                            </p>
                        </div>

                        {/* Eligibility Criteria */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold mb-3 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Eligibility Criteria
                            </h3>
                            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                {admitCard.eligibility_criteria}
                            </p>
                        </div>

                        {/* Download Button */}
                        <div className="mt-8">
                            <a
                                href={admitCard.download_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Download Admit Card
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Important Dates */}
                    <div className={`rounded-lg shadow-md p-6 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h3 className={`text-xl font-semibold mb-4 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Important Dates
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">📅</span>
                                    <span className={`font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Exam Date
                                    </span>
                                </div>
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {formatDate(admitCard.exam_date)}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">📝</span>
                                    <span className={`font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Registration Period
                                    </span>
                                </div>
                                <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    <div>Start: {formatDate(admitCard.registration_start_date)}</div>
                                    <div>End: {formatDate(admitCard.registration_end_date)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmitCardDetails;
