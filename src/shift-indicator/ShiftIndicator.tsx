//@ts-ignore
import DateTimePicker from 'react-datetime-picker';
import React from 'react';
import { Container, Row, Button, Label } from 'reactstrap';


interface State {
    selectedTime: Date
    isFire: boolean
    clicked: boolean
}

export class ShiftIndicator extends React.Component<any, State> {

    state = {
        selectedTime: new Date(),
        isFire: true,
        clicked: false
    }

    //Why is my constructor weird?
    constructor(props: any) {
        super(props);
        setInterval(this.updateTime, 1000);
    }
    lastKnownFRSduty: Date = new Date(2018, 5, 24); //R3
    lastKnownEMSduty: Date = new Date(2019, 0, 1); //R1 , R4

    updateTime = () => {
        if (!this.state.clicked) {
            this.setState({
                selectedTime: new Date()
            })
        }
    }

    getCurrentShift = (time: Date) => {
        if(this.state.isFire){
            return this.getFRSshift(time);
        }
        else{
            return this.getEMSshift(time);
        }
    }

    getFRSshift = (time: Date): number => {
        const elapsedTime = time.getTime() - this.lastKnownFRSduty.getTime(); //TODO: cannot search for a timestamp before this
        let daysPassedSince = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        const hourOfDay = time.getHours();
        const shiftScheduleFRS = [3, 2, 1];

        if (hourOfDay < 8) {
            console.log('before 8am');
            daysPassedSince -= 1;
        }
        return shiftScheduleFRS[(daysPassedSince % 3)];
    }
    getEMSshift = (time: Date): number => {
        const elapsedTime = time.getTime() - this.lastKnownEMSduty.getTime(); 
        let daysPassedSince = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        console.log({daysPassedSince})
        const hourOfDay = time.getHours();
        const shiftScheduleEMS = [1, 2, 2, 4, 4, 3, 3, 1];
        if (hourOfDay >= 20) {
            daysPassedSince += 4;
        }
        else if (hourOfDay < 8) {
            daysPassedSince += 3;
        }

        console.log(daysPassedSince)
        // console.log(hourOfDay)
        return shiftScheduleEMS[(daysPassedSince % 8)];
    }

    setTimeStamp = (value: any) => {
        this.setState({
            clicked: true,
            selectedTime: new Date(value)
        })
    }


    toggleService = () => {
        this.setState({
            isFire: !this.state.isFire
        })
    }


    render() {

        return (
            <Container className='main-container'>

                <div className='sub-container'>
                    <div className='heading'>
                        <span>
                            SG FIRE/EMS SHIFT
                        </span>
                    </div>


                    <div className='info-display'>
                        <Row className='justify-content-center'>
                            <Label className='label'>Service</Label>

                            <Button color='info' className='service-selector' onClick={this.toggleService}>
                                {this.state.isFire ? <span role="img" aria-label="fire">FIRE 🚒</span> :
                                    <span role="img" aria-label="fire">EMS 🚑</span>}
                            </Button>

                        </Row>

                        <Row className='justify-content-center'>
                            <Label className='label'>Duty Rota</Label>
                            <span className='attr-value'>{this.getCurrentShift(this.state.selectedTime)}</span>
                        </Row>
                    </div>

                    <div className='datetime-selector'>
                        <DateTimePicker
                            onChange={this.setTimeStamp}
                            value={this.state.selectedTime}
                            disableClock={true}
                            clearIcon={null}
                            calendarIcon={null}
                            format="dd/MM/y h:mm:ss a"
                        />

                    </div>
                </div>


            </ Container>

        )
    }






}