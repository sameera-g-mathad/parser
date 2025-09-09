import { useEffect } from "react";
import { Alert, Button, Input, InputGroup } from "../../reusables";
import { useAuthReducer, useAuthErrorHandler, useValidation } from "./hooks";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 
 * @returns A JSX component to reset the password of the user. Checks if the url is valid and sets the password.
 */
export const ResetPassword = () => {
    const { state, setAlertMsg, setFieldWithValue } = useAuthReducer({ password: '', confirmPassword: '' })
    // Needed to get the token present in the user.
    const location = useLocation();
    const navigate = useNavigate();
    const { withErrorHandler } = useAuthErrorHandler()
    const { isPasswordSame, isPasswordValid } = useValidation();


    const onUrlError = () => setTimeout(() => navigate('/not-found'), 3000)


    // A GET request to test if the url is valid.
    const checkIsUrlValid = withErrorHandler(async () => {
        const isValidURL = await fetch(`/api${location.pathname}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return isValidURL
    }, setAlertMsg, null, onUrlError)


    // Check for url validity on 
    // componentDidMount
    useEffect(() => {
        checkIsUrlValid()
    }, [])

    // Make a post request to reset the password
    const resetPassword = withErrorHandler(async () => {
        const { password, confirmPassword } = state;

        // check if all fields are present
        if (!password || !confirmPassword) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
        }

        // check if the password is valid.
        if (!isPasswordValid(password)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Password must have atleast one Uppercase, Lowercase and a number and and in range[15, 30] characters', status: true, id: Date.now() })
        }
        // check if passwords match.
        if (!isPasswordSame(password, confirmPassword)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Your passwords don’t match. Please try again.', status: true, id: Date.now() })
        }
        const response = await fetch(`/api${location.pathname}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, confirmPassword })
        })
        // Imp.
        return response
    }, setAlertMsg)

    return <div>
        {state.alertMsg['status'] && <Alert className={state.alertMsg.type} key={state.alertMsg.id} message={state.alertMsg.message} />}
        <InputGroup className="py-2" label="new password">
            <Input callback={(password) => setFieldWithValue('password', password)} className="auth-input w-80!" type="password" placeholder="At least 15 length" value={state.password} />
        </InputGroup>
        <InputGroup className="py-2" label="confirm password">
            <Input callback={(confirmPassword) => setFieldWithValue('confirmPassword', confirmPassword)} className="auth-input w-80!" type="password" placeholder="At least 15 length" value={state.confirmPassword} />
        </InputGroup>
        <span className="flex m-2 mt-4">
            <Button callback={resetPassword} className="auth-btn">
                <span>Submit</span>
            </Button>
        </span></div>;
};
