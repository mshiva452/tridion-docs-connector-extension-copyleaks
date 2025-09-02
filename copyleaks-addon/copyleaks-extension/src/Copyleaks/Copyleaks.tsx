import axios from 'axios';
import { useEffect, useState } from 'react';
import { ObjectInsightItemExtensionComponentConfiguration, DocumentObject, DataIndicator } from '@tridion-docs/extensions';

import apiClient from "../api/apiClient";
import styles from './Copyleaks.module.css';
import CopyleaksAction from '../components/CopyleaksAction';
import { IScanResult } from '../data/types';
import { configuration } from '../../src/globals';

export interface CopyleaksProps {
    topicTitle: string;
    topicContent: string;
}

export const Copyleaks = (props: ObjectInsightItemExtensionComponentConfiguration) => {
    const configurationObj = configuration() 
    const copyleaksClient = new apiClient(configurationObj["PROXY_SERVER_BASE_URL"]);
    const [topicData, setTopicData] = useState<CopyleaksProps>({
        topicTitle:"",
        topicContent:""
    });
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [languageCardId, setLanguageCardId] = useState<number>();
    const [erroMsg, setErrorMsg] = useState<string>("Awaiting webhook response for the scan results");
    const [accessToken, setAcccessToken] = useState<string | null>(null)
    const [scanResult, setScanResult] = useState<IScanResult | null>(null);

    const lCardId = props.activeItem as DocumentObject;
    useEffect(() => {
        if (lCardId !== null) {
            console.log(lCardId)
            const cardId = lCardId.languageCardId
            const topicDetails = topicData;
            const id = (lCardId.title as string).split("v.")[0].trim().split(" ").join("_").toLowerCase()
            topicDetails.topicTitle = id;            
            resendScanResults(id as string)
            setTopicData(topicDetails as CopyleaksProps)
            setLanguageCardId(cardId as number)
            getTopicData(cardId as number)
        }
    }, [lCardId])

    useEffect(() => {
        const access_token = copyleaksClient.getToken();
        if (accessToken !== null) {
            console.log(access_token)
            const currentTime = new Date().getTime();
            const tokenDate = access_token[".expires"];
            const TokenTime = new Date(tokenDate).getTime()
            const isTokenExpired = currentTime > TokenTime
            if (!access_token || isTokenExpired) {
                getAccessToken()
            }
        } else {
            getAccessToken()
        }
    }, [])

    const getTopicData = async (lCardId:number) => {
        const topicDetails = topicData as CopyleaksProps;
        try {
            setIsloading(true)
            const response = await axios.get(`/ISHCS/OrganizeSpace/OApi/v3/DocumentObjects/ByLanguageCardId/${lCardId}/Content`)
            console.log(response)
            if (response.status === 200) {
                topicDetails.topicContent = response.data as string
                setTopicData(topicDetails)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsloading(false)
        }
    }

    const resendScanResults = async (id: string) => {
        setScanResult(null)
        const scanId = id.split("v.")[0].trim().split(" ").join("_").toLowerCase();
        try {
            const response: any = await copyleaksClient.get(`/resend/${scanId}`);
            console.log(response)
            if (response.status === 202) {
                setErrorMsg("The Scan request has been accepted. The scan result will be available shortly.")
            }
        } catch (error: any) {
            if (error?.status === 404) {
                setErrorMsg("This item has not yet been scanned for copyleaks.")
            } else if (error?.status === 400) {
                setErrorMsg("The scan is not ready yet. Please wait for the scan to complete.")
            }
        }
    }

    const getAccessToken = async () => {
        const acess_token = await copyleaksClient.authentication(configurationObj["EMAIL"], configurationObj["API_KEY"]);
        setAcccessToken(acess_token.access_token);
    }

    return (
        <div className={styles.copyleaks}>
            <CopyleaksAction 
                topicData={topicData as CopyleaksProps} 
                errorMsg={erroMsg} 
                setErrorMsg={setErrorMsg}
                setScanResult={setScanResult}
                scanResult={scanResult as IScanResult}
            />
        </div>
    );
};
