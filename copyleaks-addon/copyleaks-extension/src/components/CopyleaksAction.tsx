import { useEffect, useState } from "react";
import { CopyleaksProps } from "../Copyleaks/Copyleaks";
import { Button, Flex, Skeleton } from "antd";
import { IScanResult } from "../data/types";
import apiClient from "../api/apiClient"
import ScanResults from "./ScanResults";
import styles from '../Copyleaks/Copyleaks.module.css';
import { configuration } from "../globals";
interface CopyleaksActionProps {
    topicData: CopyleaksProps,
    errorMsg:string;
    setErrorMsg:(error:any) => void;
    setScanResult:(result:any) => void;
    scanResult:IScanResult
}

const CopyleaksAction = ({ topicData, errorMsg,scanResult, setErrorMsg,setScanResult }: CopyleaksActionProps) => {
    const configurationObj = configuration() 
    const copyleaksClient = new apiClient(configurationObj["PROXY_SERVER_BASE_URL"]);

    const [isProcessing, setsProcessing] = useState<boolean>(false);

    const ws = new WebSocket(configurationObj["WEB_SOCKET_URL"]);

    useEffect(() => {
        ws.onopen = () => console.log('connected');
        ws.onclose = () => console.log('disconnected');
        ws.onerror = (err) => console.log("ws error");
        ws.onmessage = (event) => {
            console.log("Message from server:", event.data);
            const data = JSON.parse(event.data);
            if (data.scannedDocument.scanId === topicData?.topicTitle) {
                setScanResult(data)
                setsProcessing(false);
                if(data.results.internet.length===0){
                    setErrorMsg("Copyleaks Internet scan results are not found.")
                }
            }
        }
        return () => {
            ws.close();
        };

    }, [topicData])

    const copyleaksTopicScan = async () => {
        setsProcessing(true)
        try {

            const data = {
                "base64": btoa(unescape(encodeURIComponent(topicData.topicContent))),    //Need to fix unescape depricated method,
                "filename": `${topicData?.topicTitle}.txt`,
                "properties": {
                    "webhooks": {
                        "status": configurationObj["WEB_HOOKS_URL"],
                        "newResult": configurationObj["WEB_HOOKS_NEWRESULT"]
                    }
                }
            }
            const response = await copyleaksClient.post(`/scan/${topicData?.topicTitle}`, data);
            console.log(response)
            setsProcessing(false)
        } catch (error) {
            setsProcessing(false)
            console.log("Failed to scan the component for copyleaks", error)
        }
        finally{
            setsProcessing(false)
        }
    }

    return (
        <Flex vertical >
            <h2 title="Copyleaks Scan Properties" className={styles.ckBoPy}>Copyleaks Scan Properties</h2>
            <Button onClick={copyleaksTopicScan}>Scan Comopnent</Button>
            {
                isProcessing ?
                    <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </>
                    :
                    <ScanResults scanId={topicData?.topicTitle as string} scanResult={scanResult as IScanResult} isProcessing={isProcessing} errorMsg={errorMsg} />
            }
        </Flex>
    )
}

export default CopyleaksAction;