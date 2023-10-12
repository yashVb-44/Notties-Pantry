import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Demo = () => {

    const [Data, setData] = useState([])

    useEffect(() => {
        async function getCategory() {

            try {
                const res = await axios.get(`${`http://192.168.0.5:8000`}/product/get`
                );

                setData(res?.data?.product || []);
                // setIsLoading(false)
                console.log(Data)
            } catch (error) {
                // setIsLoading(false)
            }
        }
        getCategory();
    }, [Data]);

    return (
        <>
            <iframe src='http://192.168.0.5:8000/imageUploads/backend/product/demo4.mp4'
                frameborder='0'
                allow='autoplay; encrypted-media'
                allowfullscreen
                title='video'
                height={250}
                width={300}
            />
        </>
    )
}


export default Demo
