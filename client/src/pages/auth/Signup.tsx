import { Link } from "react-router-dom";
import { Alert, Button, Input, InputGroup } from "@/reusables";
import { useCustomReducer, useErrorHandler, useValidation } from "@/hooks";


/**
 * 
 * @returns A JSX component that allows users to signup to the parser website.
 */
export const Signup = () => {
    const { state, setAlertMsg, setFieldWithValue } = useCustomReducer({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const { withErrorHandler } = useErrorHandler()

    const { isEmailValid, isPasswordSame, isPasswordValid } = useValidation();

    const signUp = withErrorHandler(async () => {
        const { firstName, lastName, email, password, confirmPassword } = state;

        // check if any field is null.
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
        }
        // check if email is valid.
        if (!isEmailValid(email)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please enter a valid email address with .edu, .com, .dev or .org domain.', status: true, id: Date.now() })
        }

        // check if password is valid.
        if (!isPasswordValid(password)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Password must have atleast one Uppercase, Lowercase and a number and and in range[15, 30] characters', status: true, id: Date.now() })
        }

        // check if passwords match
        if (!isPasswordSame(password, confirmPassword)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Your passwords don’t match. Please try again.', status: true, id: Date.now() })
        }

        // make a POST request.
        const response = await fetch('/api/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
        })
        // return the response - Required.
        return response
    }, setAlertMsg)

    return <div className="m-1">
        {state.alertMsg['status'] && <Alert className={state.alertMsg['type']} key={state.alertMsg['id']} message={state.alertMsg['message']} />}
        <div className="flex justify-evenly">

            <InputGroup label="first name">
                <Input callback={(firstName: string) => setFieldWithValue('firstName', firstName)} className="auth-input " type="text" placeholder="John" value={state.firstName} />
            </InputGroup>

            <InputGroup label="last name">
                <Input callback={(lastName: string) => setFieldWithValue('lastName', lastName)} className="auth-input " type="text" placeholder="Doe" value={state.lastName} />
            </InputGroup>

        </div>

        <InputGroup className="py-2" label="email">
            <Input callback={(email: string) => setFieldWithValue('email', email)} className="auth-input " type="email" placeholder="Example@email.com" value={state.email} />
        </InputGroup>

        <InputGroup className="py-2" label="password">
            <Input callback={(password: string) => setFieldWithValue('password', password)} className="auth-input " type="password" placeholder="At least 15 characters." value={state.password} />
        </InputGroup>

        <InputGroup className="py-2" label="confirm password">
            <Input callback={(confirmPassword: string) => setFieldWithValue('confirmPassword', confirmPassword)} className={`auth-input`} type="password" placeholder="At least 15 characters." value={state.confirmPassword} />
        </InputGroup>

        <span className="flex m-2 my-4">
            <Button callback={signUp} className="auth-btn">
                <span>Submit</span>
            </Button>
        </span>

        <span className="flex justify-center m-2">
            <span className="mr-2">Have an account? </span><Link className="text-blue-700" to="/auth/sign-in">Sign In</Link>
        </span>

    </div>;
};
