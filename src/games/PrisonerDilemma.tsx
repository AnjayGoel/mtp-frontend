import React, {useState} from 'react';
import {Button, Col, Divider, Row, Select, Slider, Space, Typography} from "antd";
import pdImage from "../assets/pd.png"

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface PrisonerDilemmaProps {
  callback: Function
}

const PrisonerDilemma = ({callback}: PrisonerDilemmaProps) => {

  const [action, setAction] = useState<string | null>(null)
  const [response, setResponse] = useState<number>(5)


  return (
    <Typography>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <img style={{width: '30em', height: '25em'}} src={pdImage}/>
        <div style={{paddingRight: '10px'}}>
          The police has arrested you and your friend for a crime. Both of you are held in different cells.
          The police officer offers you both the opportunity to either remain silent or blame another suspect.
          <ul>
            <li>If both of you <Text strong>remain silent</Text>, both will serve only <Text strong>one year in
              prison</Text>.
            </li>
            <li>If you <Text strong>both blame each other</Text>, both will <Text strong>serve five years</Text> in
              prison.
            </li>
            <li>If one of you blames another and the other remains silent, the one who
              remained silent would serve <Text strong>twenty years</Text> in prison, while <Text strong>the other would
                be set free</Text>.
            </li>
          </ul>
        </div>
        <Divider/>
        {action === null && (
          <div>
            What wil you do?
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => setAction('c')}>Confess</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('d')
                }}>Remain Silent</Button>
              </Col>
            </Row>
          </div>
        )}
        {action !== null && (
          <div>
            How trustworthy is the other player?
            <Row gutter={24} style={{width: '40vw'}}>
              <Col span={20}>
                <Slider
                  defaultValue={5} min={0} max={10}
                  marks={Object.fromEntries([...Array(11)].map((_, it) => {
                    return [it, it]
                  }))}
                  onChange={(value: number) => {
                    setResponse(value)
                  }}/>
              </Col>
              <Col span={4}>
                <Button block onClick={() => {
                  callback({action: action, response: response})
                }}>
                  Done
                </Button></Col>
            </Row>
          </div>
        )}
      </div>
    </Typography>
  )
};

export default PrisonerDilemma;
