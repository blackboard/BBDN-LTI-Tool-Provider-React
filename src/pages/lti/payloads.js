import React, {useEffect, useState} from "react";
import {Accordion, Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import JSONTree from "react-json-tree";
import toolClient from "../../util/toolClient";
import {deepLinkingStyles} from "./deepLinkContentStyles";

/**
 * Universal Payload Viewer
 * @param token token key to obtain the JWT Payload
 * @constructor
 */
export function PayloadViewer({token}) {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [payload, setPayload] = useState(null)

    useEffect(() => {
        toolClient.getLaunchJWTPayload(token).then(resp => resp.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPayload(result)
                },

                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )

    }, [token])

    return (
        <Card>
            <JsonAccordion json={payload} title={'Launch JWT'}/>
        </Card>
    )
}

/**
 * Component to display any JSON File
 * @param json Object to be displayed
 * @param title Title for the Element
 * @returns {JSX.Element}
 * @constructor
 */
export function JsonAccordion({json, title}) {
    const styles = deepLinkingStyles();
    const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
    };

    return (
        <Accordion defaultActiveKey={"1"} className={styles.payloadViewer}>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant={"link"} eventKey={"0"}>
                        {title}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={"0"} className={"json_viewer"}>
                    <JSONTree data={json} hideRoot={true} theme={theme}/>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}