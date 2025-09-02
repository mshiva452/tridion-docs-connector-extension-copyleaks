import { Flex, Progress, ProgressProps } from "antd";
import { IScanResult } from "../data/types";
import { ExternalLink } from "lucide-react";
import NotFound from "./NotFound";

interface IScanResultProps {
    scanId: string;
    scanResult: IScanResult;
    isProcessing: boolean;
    errorMsg:string
}

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

const ScanResults = ({ scanId, scanResult, isProcessing,errorMsg }: IScanResultProps) => {
    return(
        <Flex vertical>
        {
            scanResult !== null ?
                <>
                    <h2 style={{ fontWeight: "normal", fontSize: 18 }}>Scan Id :{scanId}</h2>
                    {
                        scanResult?.results.internet.length !== 0 ? scanResult?.results.internet.map((item: any) => {
                            //scanResult.map(item => {
                            return (
                                <Flex vertical gap={5} key={item.id} style={{ borderTop: "1px solid #ddd", paddingBottom: 10, paddingTop: 10 }}>
                                    <h2 style={{ margin: 0, fontSize: 16 }}>{item.title}</h2>
                                    <Flex align="flex-start" gap={5} vertical>
                                        <a href={item.url} target="_blank" style={{ display: "flex", alignItems: "center", fontSize: 14, gap: 3 }}>
                                            <ExternalLink size="18" />{item.url}
                                        </a>
                                    </Flex>
                                    <Flex gap={10} vertical style={{marginTop:5}}>
                                        <Flex gap={1} vertical>
                                            <span style={{ lineHeight: "10px" }}>Identical Words</span>
                                            <Progress type="line" status="exception" percent={item.identicalWords} format={(percent) => `${item.identicalWords} (${((item.identicalWords/item.totalWords)*100).toFixed(1)}%)` } />
                                        </Flex>
                                        <Flex gap={1} vertical>
                                            <span style={{ lineHeight: "10px" }}>Matched Words</span>
                                            <Progress type="line" status="active" strokeColor={twoColors} percent={item.matchedWords} format={(percent) => `${item.matchedWords} (${((item.matchedWords/item.totalWords)*100).toFixed(1)}%)` } />
                                        </Flex>
                                        <Flex gap={1} vertical>
                                            <span style={{ lineHeight: "10px" }}>Paraphrased Words</span>
                                            <Progress type="line" strokeColor={"#fed5a9"} percent={item.paraphrasedWords} format={(percent) => `${item.paraphrasedWords} (${((item.paraphrasedWords/item.totalWords)*100).toFixed(1)}%)`} />
                                        </Flex>
                                        {/*  <div>Similar Words:{item.similarWords}</div> */}
                                        <Flex gap={1} vertical>
                                            <span style={{ lineHeight: "10px" }}>Total Words</span>
                                            <Progress type="line" strokeColor={twoColors} percent={item.totalWords} format={(percent) => item.totalWords} />
                                        </Flex>
                                        <Flex vertical>
                                            {
                                                item.tags.map((tag: string, idx: number) => {
                                                    return (
                                                        <div key={idx}>{tag}</div>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                        })
                            :
                            <Flex align="center" justify="center">
                                <NotFound description={errorMsg} isLoading={isProcessing} />
                            </Flex>
                    }
                </>
                :
                <NotFound description={errorMsg} isLoading={isProcessing}/>
        }
    </Flex>
    )
}

export default ScanResults;