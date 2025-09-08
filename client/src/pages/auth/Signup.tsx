import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Input, InputGroup } from "../../reusables";
import { useAuthReducer, useValidation } from "./hooks";


export const Signup = () => {
    const { state, setAlertMsg, setFieldWithValue } = useAuthReducer({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const { isEmailValid, isPasswordSame, isPasswordValid } = useValidation();


    const signUp = async () => {
        try {
            const { firstName, lastName, email, password, confirmPassword } = state;
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
            }


            if (!isEmailValid(email)) {
                return setAlertMsg({ type: 'alert-danger', message: 'Please enter a valid email address with .edu, .com, or .org domain.', status: true, id: Date.now() })
            }

            if (!isPasswordValid(password)) {
                return setAlertMsg({ type: 'alert-danger', message: 'Password must have atleast one Uppercase, Lowercase and a number and and in range[15, 30] characters', status: true, id: Date.now() })
            }

            if (!isPasswordSame(password, confirmPassword)) {
                return setAlertMsg({ type: 'alert-danger', message: 'Your passwords don’t match. Please try again.', status: true, id: Date.now() })
            }

            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
            })
            const data = await response.json();
            if (data.status === 'success') {
                return setAlertMsg({ type: 'alert-success', message: data.message, status: true, id: Date.now() })
            }
            throw Error(data.message)

        }
        catch (error: unknown) {
            let message = (error as Error).message || 'Something went wrong, Try again later.'
            return setAlertMsg({ type: 'alert-danger', message, status: true, id: Date.now() })
        }

    }
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
