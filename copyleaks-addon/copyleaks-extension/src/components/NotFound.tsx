import { DataIndicator } from "@tridion-docs/extensions";
import { Flex } from "antd";
import {useEffect} from "react";

interface NotfoundProps {
    description: string,
    isLoading: boolean
}
const NotFound = ({ description, isLoading }: NotfoundProps) => {

    useEffect(() => {
        console.log(description)
    },[description])
    return (
        <Flex align="center" style={{ paddingTop: "100%" }}>
            <DataIndicator isLoading={isLoading} noDataMessage={description}>
                <div>This content will be visible if isLoading set to false</div>
            </DataIndicator>
        </Flex>
    )
}

export default NotFound;