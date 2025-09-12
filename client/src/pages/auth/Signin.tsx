import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Input, InputGroup } from "@/reusables";
import { useAuth } from "@/context/authContext";
import { useCustomReducer, useErrorHandler, useValidation } from "@/hooks";

/**
 * 
 * @returns A JSX element that is used to login the users
 * into parser application
 */
export const Signin = () => {
    const { state, setAlertMsg, setFieldWithValue } = useCustomReducer({
        email: '',
        password: '',
    })
    const { login } = useAuth()
    const { isEmailValid } = useValidation();
    const { withErrorHandler } = useErrorHandler()
    const navigate = useNavigate()

    // A callback that will be used by 
    // withErrorHandler to signIn the user.
    // The login is used to set the user.
    const onSuccessfulSignIn = () => {
        login();
        navigate('/app/dashboard')
    }

    // Make a POST request to the server to login the user.
    const signIn = withErrorHandler(async () => {
        const { email, password } = state;
        if (!email || !password) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
        }

        if (!isEmailValid(email)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please enter a valid email address with .edu, .com, .dev or .org domain.', status: true, id: Date.now() })
        }

        const response = await fetch('/api/auth/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        return response;
        // redirect suddenly without waiting.
    }, setAlertMsg, onSuccessfulSignIn)

    return <div>
        {state.alertMsg.status && <Alert className={state.alertMsg.type} message={state.alertMsg.message} key={state.alertMsg.id} />}
        <InputGroup className="py-2" label="email">
            <Input callback={(email) => setFieldWithValue('email', email)} className="auth-input w-80!" type="email" value={state.email} placeholder="Example@email.com" />
        </InputGroup>
        <InputGroup className="py-2" label="password">
            <Input callback={(password) => setFieldWithValue('password', password)} className="auth-input w-80!" type="password" placeholder="At least 15 characters." value={state.password} />
        </InputGroup>
        <span className="flex justify-end m-2 text-blue-700">
            <Link to="/auth/forgot-password">Forgot Password?</Link>
        </span>
        <span className="flex m-2">
            <Button callback={signIn} className="auth-btn">
                <span>Submit</span>
            </Button>
        </span>
        <span className="flex justify-center m-2">
            <span className="mr-2">Don't have an account? </span><Link className="text-blue-700" to="/auth/sign-up">Sign Up</Link>
        </span>
    </div>;
};
