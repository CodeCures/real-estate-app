'use client';

import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { getAiInsights } from '@/services/app.service';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const AiInsight = () => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    const session = useSession()
    const user = session.data?.user

    useEffect(() => {
        async function loadInsights() {
            try {

                if (user) {
                    console.log({ user });

                    // const data = (await axios.post('http://localhost:4000/api/ai', {}, {
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         'Authorization': `Bearer ${user?.accessToken}`
                    //     }
                    // })).data

                    // setInsight(data);

                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error('Failed to load insights:', error);
            }
        }

        loadInsights();
    }, [user]);

    return (
        <div className="w-[895px]">
            {loading ? <Spinner loading={loading} /> : <div>this is it</div>}
        </div>
    );
};

export default AiInsight;
