import { Alert, Button, Input, InputGroup } from "@/reusables";
import { useAuthReducer, useAuthErrorHandler, useValidation } from "./hooks";
/**
 * 
 * @returns A JSX component for the user to request password reset.
 */
export const ForgotPassword = () => {
    const { state, setAlertMsg, setFieldWithValue } = useAuthReducer({ email: '' })
    const { isEmailValid } = useValidation();
    const { withErrorHandler } = useAuthErrorHandler()

    /**
     * Method to send email to reset password to the user.
     * @returns void
     */
    const forgotPassword = withErrorHandler(async () => {
        // validate email.
        if (!isEmailValid(state.email)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please enter a valid email address with .edu, .com, or .org domain.', status: true, id: Date.now() })
        }

        // Make a POST request to receive a reset email.
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: state.email })
        })
        return response;
    }, setAlertMsg)

    return <div>
        {state.alertMsg['status'] && <Alert className={state.alertMsg.type} key={state.alertMsg.id} message={state.alertMsg.message} />}
        <InputGroup className="py-2" label="email">
            <Input callback={(email) => setFieldWithValue('email', email)} className="auth-input w-80!" type="email" placeholder="Example@email.com" value={state.email} />
        </InputGroup>
        <span className="flex m-2 mt-4">
            <Button callback={forgotPassword} className="auth-btn">
                <span>Submit</span>
            </Button>
        </span></div>;
};
