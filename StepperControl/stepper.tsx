import * as React from 'react';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { StepIconProps } from '@material-ui/core/StepIcon';
import xml2js from "xml2js";
import { any } from 'prop-types';

import Nonlinear from './nonlinear';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props: StepIconProps) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '90%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

export default function CustomizedSteppers(props: any) {
  const classes = useStyles();
  const intialValue = props.activeStep;
  const [activeStep, setActiveStep] = React.useState(intialValue);
  const steps = props.steps;
  const display = props.flowType;

  React.useEffect(() => {

    /////////////////////Here is the XML parsed array in console
    var xml2js = require("xml2js");
    var xpath = require("xml2js-xpath");

    xml2js.parseString(`<?xml version="1.0" encoding="utf-8"?>
    <manifest>
      <control namespace="PCFNamespace2" constructor="StepperControl" version="0.0.8" display-name-key="Test3" description-key="Updated Stepper Control WCS Edition" control-type="standard">
        <!-- property node identifies a specific, configurable piece of data that the control expects from CDS -->
        <property name="flowTypeProperty" display-name-key="SubProcessType" description-key="Sub Business Process" of-type="SingleLine.Text" usage="input" required="true" />
     <property name="entity" display-name-key="entity_Display_Key" description-key="entity_Desc_Key" of-type="SingleLine.Text" usage="input" required="true" />
      <property name="attributeProperty" display-name-key="attribute_Display_Key" description-key="attribute_Desc_Key" of-type="SingleLine.Text" usage="input" required="true" />
      <property name="stages" display-name-key="stages_Display_Key" description-key="stages_Desc_Key" of-type="OptionSet" usage="bound" required="true" />

        <!-- 
          Property node's of-type attribute can be of-type-group attribute. 
          Example:
          <type-group name="numbers">
            <type>Whole.None</type>
            <type>Currency</type>
            <type>FP</type>
            <type>Decimal</type>
          </type-group>
          <property name="sampleProperty" display-name-key="Property_Display_Key" description-key="Property_Desc_Key" of-type-group="numbers" usage="bound" required="true" />
        -->

        <resources>
          <code path="index.ts" order="1" />
          <css path="StepperControl.css" order="1" />
          <!-- UNCOMMENT TO ADD MORE RESOURCES
          <css path="css/StepperControl.css" order="1" />
          <resx path="strings/StepperControl.1033.resx" version="1.0.0" />
          -->
        </resources>

    <feature-usage>
         <uses-feature name="Utility" required="true" />
          <uses-feature name="WebAPI" required="true" />

           <!-- UNCOMMENT TO ENABLE THE SPECIFIED API
          <uses-feature name="Device.captureAudio" required="true" />
          <uses-feature name="Device.captureImage" required="true" />
          <uses-feature name="Device.captureVideo" required="true" />
          <uses-feature name="Device.getBarcodeValue" required="true" />
          <uses-feature name="Device.getCurrentPosition" required="true" />
          <uses-feature name="Device.pickFile" required="true" />
          -->

           </feature-usage>
      </control>
    </manifest>`, function (err: string, json: JSON) {
      // find all elements: returns xml2js JSON of the element
      var matches = xpath.find(json, "//message");

      // Extract text representation of XML document:
      console.log(matches)
    });
    /////////////////////Here is the XML parsed array in console
  }, [])

  

  function handleNext() {
    setActiveStep((prevActiveStep:number) => prevActiveStep + 1);
    props.refreshData(activeStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
    props.refreshData(activeStep- 1);
  }

  function handleReset() {
    setActiveStep(0);
    props.refreshData(0);
  }

  return (
    <div className={classes.root}>
        <div className = {display == "Linear Basic Bar" ? "show":"hide"}>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </div>
      <div className = {display == "Linear Basic Dotted" ? "show":"hide"}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </div>
      <div className = {display == "Linear Basic Customized" ? "show":"hide"}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </div>
      <div className = "align-center">
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
