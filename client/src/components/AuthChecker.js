import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthChecker = () => {
    const userID = sessionStorage.getItem('userID');
    const navigate = useNavigate();

    useEffect(() => {
        if (userID === '') {
            navigate('/login');
        }
    }, [userID, navigate]);

    return null;
};

export default AuthChecker;
