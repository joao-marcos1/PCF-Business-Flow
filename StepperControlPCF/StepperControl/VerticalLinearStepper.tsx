import * as React from 'react';
import * as DOMPurify from 'dompurify';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '90%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
);

export default function VerticalLinearStepper(props: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = props.steps;

  function handleNext() {
    setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    props.refreshData();
  }

  function handleBack() {
    setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    props.refreshData();
  }

  function handleReset() {
    setActiveStep(0);
    props.refreshData();
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ name, desc }: any) => (
          <Step key={name}>
            <StepLabel>{name}</StepLabel>
            <StepContent>
              <Typography dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
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
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
