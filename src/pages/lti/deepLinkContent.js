import '../../App.css';
import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Plus, ShieldMinus} from "react-bootstrap-icons";
import {Card, FormControl, InputGroup} from "react-bootstrap";
import {JsonAccordion, PayloadViewer} from "./payloads";
import {useParams} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import toolClient from "../../util/toolClient";
import {deepLinkingStyles} from "./deepLinkContentStyles";
import { useTranslation, Trans } from 'react-i18next';


/**
 * Deep Linking page
 * @returns {JSX.Element}
 * @constructor
 */
function DeepLinkContent() {

  const styles = deepLinkingStyles();
  const [items, setItems] = useState([]);
  let {token} = useParams();
  const { t, i18n } = useTranslation();

  const contentTypes = [
    {key: "lti_link", label: "LTI Link"},
    {key: "lti_link_embedded", label: "LTI Embedded Link"},
    {key: "lti_link_new_window", label: "LTI Link in a New Window"},
    {key: "lti_link_file", label: "LTI Link File"},
    {key: "lti_link_html", label: "LTI Link HTML"},
    {key: "lti_link_image", label: "LTI Link Image"}
  ]

  return (
    <MDBContainer fluid>
      <Card.Title>
        <Trans>Tool Title</Trans>
      </Card.Title>
      <Card.Body>
        <Card className={styles.toolContainer}>
          <Card className={styles.contentTypesContainer}>
            <Card.Title>
              <Trans>LTI Content Types</Trans>
            </Card.Title>
            <Card.Body>
              {contentTypes.map((content_type) => (
                <LtiContentType data={{name: content_type.label, key: content_type.key}} items={items}
                                setItemsCallback={(i) => {
                                  setItems(i)
                                }}/>
              ))}
            </Card.Body>
          </Card>
          <Card className={styles.payloadsContainer}>
            <Card.Title>
              <Trans>Payloads</Trans>
            </Card.Title>
            {
              (token !== undefined && token !== null) &&
              <PayloadViewer token={token} title={'LMS Payload'}/>
            }
          </Card>
        </Card>
        <LtiContentRequest items={items}/>
      </Card.Body>

    </MDBContainer>
  );

}

/**
 * Container for a single LTI Content Type
 * @param data LTI Content Type data
 * @param items Current amount for Content Type
 * @param setItemsCallback Callback to set state
 * @returns {JSX.Element}
 * @constructor
 */
function LtiContentType({data, items, setItemsCallback}) {

  const styles = deepLinkingStyles();
  const [count, setCount] = useState(0);

  function increment(key, items) {
    let addNew = true;

    for (let item of items) {
      if (item.content_type === key) {
        addNew = false;
        item.amount = item.amount + 1;
        break;
      }
    }

    if (addNew) {
      items.push({content_type: key, amount: 1});
    }

    setItemsCallback(items)
  }

  /**
   * Reduce the amount of items by 1
   * @param key Content type key to update the items object
   * @param items Object that contains all the items
   */
  function decrement(key, items) {
    let index = undefined;

    for (let i = 0; i < items.length; i++) {
      if (items[i].content_type === key) {
        if (items[i].amount > 1) {
          items[i].amount = items[i].amount - 1;
        } else if (items[i].amount === 1) {
          index = i;
        }
      }
    }

    if (index !== undefined) {
      items.splice(index, 1);
    }

    setItemsCallback(items);
  }

  /**
   * Set the amount of content type with the input text
   * @param key Content type key to update the items object
   * @param value Value incoming from input
   * @param items Object that contains all the items
   */
  function setValue(key, value, items) {
    let index;
    let addNew = true;

    for (let i = 0; i < items.length; i++) {
      addNew = false;
      if (items[i].content_type === key) {
        if (value === 0) {
          index = i;
        } else if (value > 0) {
          items[i].amount = value;
        } else if (items[i].amount === 1) {
          index = i;
        }
      }
    }

    if (index) {
      items.splice(index, 1);
    } else if (addNew) {
      items.push({content_type: key, amount: value});
    }
    setItemsCallback(items);
  }

  return (
    <Card className={styles.contentTypeContainer}>
      <Card.Body>
        <div className={styles.contentTypeInputGroup}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend className={styles.contentTypeName}>
              <InputGroup.Text><Trans>{data.name}</Trans> </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={count} onChange={e => {
              const newValue = e.target.value
              setCount(newValue)
              setValue(data.key, newValue, items)

            }} onInput={event => {
              const keyCode = event.keyCode || event.which;
              const keyValue = String.fromCharCode(keyCode);
              if (/\+|-/.test(keyValue))
                event.preventDefault();
            }}
            />
          </InputGroup>
        </div>
        <Button variant="danger" onClick={() => {
          if (count > 0) {
            setCount(count - 1)
            decrement(data.key, items)
          }
        }}>
          <ShieldMinus/>
        </Button>


        <Button variant="success" onClick={() => {
          setCount(count + 1)
          increment(data.key, items)
        }}>
          <Plus/>
        </Button>
      </Card.Body>
    </Card>
  );

}

/**
 * Request handler
 * @param items
 * @returns {JSX.Element}
 * @constructor
 */
function LtiContentRequest({items}) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [response, setResponse] = useState(null)

  /**
   *
   * @returns {Promise<void>}
   */
  async function getLTIContent() {

    toolClient.getLTIContent(items).then()
      .then(
        (result) => {
          setIsLoaded(true);
          setResponse(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  async function doFormPost() {

  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <Button onClick={getLTIContent}>
        <Trans>Request</Trans>
      </Button>
    );
  } else {
    return (
      <Card>
        <Card.Body>
          <JsonAccordion json={items} title={'Items'}/>
          <Button onClick={getLTIContent}>
            <Trans>Update</Trans>
          </Button>
          <Button onClick={doFormPost}>
            <Trans>Submit</Trans>
          </Button>
        </Card.Body>
      </Card>

    );
  }
}


export default DeepLinkContent;
