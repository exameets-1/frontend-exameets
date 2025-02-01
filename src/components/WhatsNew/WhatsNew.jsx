import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestJobs } from '../../store/slices/jobSlice';
import { fetchLatestGovtJobs } from '../../store/slices/govtJobSlice';
import { fetchLatestInternships } from '../../store/slices/internshipSlice';
import { fetchLatestScholarships } from '../../store/slices/scholarshipSlice';
import { fetchLatestResults } from '../../store/slices/resultSlice';
import { fetchLatestAdmitCards } from '../../store/slices/admitCardSlice';
import { fetchLatestAdmissions } from '../../store/slices/admissionSlice';
import { fetchLatestYears } from '../../store/slices/previousSlice';
import { performGlobalSearch, clearSearchResults } from '../../store/slices/globalSearchSlice';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './WhatsNew.css';

const WhatsNew = () => {
    const dispatch = useDispatch();
    const [latestEntries, setLatestEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    
    const { latestJobs = [], loading: jobsLoading } = useSelector((state) => state.jobs);
    const { latestGovtJobs = [], loading: govtJobsLoading } = useSelector((state) => state.govtJobs);
    const { latestInternships = [], loading: internshipsLoading } = useSelector((state) => state.internships);
    const { latestScholarships = [], loading: scholarshipsLoading } = useSelector((state) => state.scholarships);
    const { latestResults = [], loading: resultsLoading } = useSelector((state) => state.results);
    const { latestAdmitCards = [], loading: admitCardsLoading } = useSelector((state) => state.admitCards);
    const { latestAdmissions = [], loading: admissionsLoading } = useSelector((state) => state.admissions);
    const { latestYears = [], loading: yearsLoading } = useSelector((state) => state.previousYears);
    const { searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.globalSearch);

    useEffect(() => {
        dispatch(fetchLatestJobs());
        dispatch(fetchLatestGovtJobs());
        dispatch(fetchLatestInternships());
        dispatch(fetchLatestScholarships());
        dispatch(fetchLatestResults());
        dispatch(fetchLatestAdmitCards());
        dispatch(fetchLatestAdmissions());
        dispatch(fetchLatestYears());
    }, [dispatch]);

    const getTimestampFromObjectId = (objectId) => {
        if (!objectId || typeof objectId !== 'string' || objectId.length !== 24) {
            return 0;
        }
        return parseInt(objectId.substring(0, 8), 16) * 1000;
    };

    useEffect(() => {
        const entries = [
            ...(latestJobs?.map(item => ({ ...item, type: 'job' })) || []),
            ...(latestGovtJobs?.map(item => ({ ...item, type: 'govtjob' })) || []),
            ...(latestInternships?.map(item => ({ ...item, type: 'internship' })) || []),
            ...(latestScholarships?.map(item => ({ ...item, type: 'scholarship' })) || []),
            ...(latestResults?.map(item => ({ ...item, type: 'result' })) || []),
            ...(latestAdmitCards?.map(item => ({ ...item, type: 'admitcard' })) || []),
            ...(latestAdmissions?.map(item => ({ ...item, type: 'admission' })) || []),
            ...(latestYears?.map(item => ({ ...item, type: 'previousyear' })) || [])
        ];

        const sortedEntries = entries
            .filter(entry => entry && entry._id)
            .sort((a, b) => {
                const timestampA = getTimestampFromObjectId(a._id);
                const timestampB = getTimestampFromObjectId(b._id);
                return timestampB - timestampA;
            });

        setLatestEntries(sortedEntries);
    }, [latestJobs, latestGovtJobs, latestInternships, latestScholarships, latestResults, latestAdmitCards, latestAdmissions, latestYears]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm.trim() === '') {
            dispatch(clearSearchResults());
            return;
        }

        dispatch(performGlobalSearch(debouncedSearchTerm));
    }, [debouncedSearchTerm, dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getEntryLink = (entry) => {
        if (!entry || !entry.type || !entry._id) return '#';
        
        switch(entry.type) {
            case 'job': return `/job/get/${entry._id}`;
            case 'govtjob': return `/govtjob/get/${entry._id}`;
            case 'internship': return `/internship/get/${entry._id}`;
            case 'scholarship': return `/scholarship/get/${entry._id}`;
            case 'result': return `/results/get/${entry._id}`;
            case 'admitcard': return `/admitcard/get/${entry._id}`;
            case 'admission': return `/admission/get/${entry._id}`;
            case 'previousyear': return `/previous-year-details/${entry.subject}`;
            default: return '#';
        }
    };

    const getEntryTitle = (entry) => {
        if (!entry) return '';
        
        switch(entry.type) {
            case 'job':
                return `${entry.role || ''} at ${entry.organization || ''}`;
            case 'govtjob':
                return `${entry.role || ''} at ${entry.organization || ''}`;
            case 'internship':
                return `${entry.title || ''} at ${entry.organization || ''}`;
            case 'previousyear':
                return `PYQ for ${entry.subject || ''} - ${entry.year || ''}`;
            case 'scholarship':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            case 'admission':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            case 'result':
                return `${entry.exam_title || ''} - ${entry.organization || ''}`;
            case 'admitcard':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            default:
                return entry.title || '';
        }
    };

    const isLoading = jobsLoading || govtJobsLoading || internshipsLoading || 
                      scholarshipsLoading || resultsLoading || admitCardsLoading || 
                      admissionsLoading || yearsLoading || searchLoading;

    const displayEntries = searchTerm.trim() !== '' ? 
        [...(searchResults || [])].sort((a, b) => {
            const timestampA = getTimestampFromObjectId(a._id);
            const timestampB = getTimestampFromObjectId(b._id);
            return timestampB - timestampA;
        }) : 
        latestEntries;

    return (
        <div className="teams-container">
            <div className="teams-wrapper">
                <div className="whats-new-header">
                    <h2>What&lsquo;s New</h2>
                </div>
                
                <div className="search-box">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="        Search across all sections..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
    
                <div className="teams-table-container">
                    <div className="scrollable-content">
                        {isLoading ? (
                            <div className="loading-spinner">
                            <div className="spinner"></div>
                          </div>
                        ) : searchError ? (
                            <div className="error-text">
                                {searchError}
                            </div>
                        ) : displayEntries.length === 0 ? (
                            <div className="no-entries-text">
                                {searchTerm.trim() !== '' ? 'No results found' : 'No entries available'}
                            </div>
                        ) : (
                            <table className="teams-table">
                                <tbody>
                                    {displayEntries.map((entry, index) => (
                                        <tr 
                                            key={entry._id || index}
                                            className="clickable-row"
                                        >
                                            
                                            <td>{getEntryTitle(entry)}</td>
                                        
                                            <td>
                                                <Link 
                                                    to={getEntryLink(entry)}
                                                    className="verify-button"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                <div className="view-all">
                    <Link to="/whatsnew">
                        <button className="verify-button">View All</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;