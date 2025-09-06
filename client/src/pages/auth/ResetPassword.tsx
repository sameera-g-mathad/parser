import React from "react";
import { Alert, Button, Input, InputGroup } from "../../reusables";
import { useAuthReducer, useValidation } from "./hooks";

export const ResetPassword = () => {
    const { state, setAlertMsg, setFieldWithValue } = useAuthReducer({ password: '', confirmPassword: '' })
    const { isPasswordSame, isPasswordValid } = useValidation();

    const resetPassword = async () => {
        if (!state.password || !state.confirmPassword) {
            return setAlertMsg({ type: 'alert-danger', message: 'Please complete all required fields.', status: true, id: Date.now() })
        }
        if (!isPasswordValid(state.password)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Password must have atleast one Uppercase, Lowercase and a number and and in range[15, 30] characters', status: true, id: Date.now() })
        }
        if (!isPasswordSame(state.password, state.confirmPassword)) {
            return setAlertMsg({ type: 'alert-danger', message: 'Your passwords don’t match. Please try again.', status: true, id: Date.now() })
        }
    }
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
