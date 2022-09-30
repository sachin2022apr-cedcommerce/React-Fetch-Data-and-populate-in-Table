import React, { useCallback } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormLayout, TextField, TextStyle } from '@shopify/polaris';

function Home({ successToken, setSuccessToken }) {

    // states for username and password
    var [username, setUsername] = useState("");
    var [password, setPassword] = useState("");

    // satate for loader
    var [isLoading, setIsLoading] = useState(false)

    // state for login error
    var [error, setError] = useState("");

    // navigation for login
    var loginN = useNavigate();

    var fetchOperation = {
        method: 'POST', headers: {
            'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA'
        }
    }

    // Authorizing user
    var handleSubmit = (event) => {
        event.preventDefault();
        // start loader
        setIsLoading(true)

        // if username and password is not blank
        if (username !== "" && password !== "") {
            setError("")
            // get user authoriezed
            fetch(`https://fbapi.sellernext.com/user/login?username=${username}&password=${password}`, fetchOperation)
                .then((res) => res.json())
                .then((temp) => {
                    // if user token is valid
                    if (temp.success) {
                        sessionStorage.clear();
                        // set token in session storage
                        sessionStorage.setItem("token", temp.data.token);
                        setError("")
                        // navigate to dashboard
                        loginN('/dashboard')
                    }
                    // if not authorized 
                    else { setError("Login Failed") }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setError("Enter Username and Password")
            setIsLoading(false)
        }
    }

    // getting usename and password to the state
    const handleUsername = useCallback((value) => setUsername(value), []);
    const handlePassword = useCallback((value) => setPassword(value), []);

    return (
        <div className='home'>
            <Form onSubmit={(event) => handleSubmit(event)}>
                <FormLayout >
                    <TextField type="text" label="Username" value={username}
                        onChange={handleUsername} autoComplete="email" />
                    <TextField type="password" label="Account email" value={password}
                        onChange={handlePassword} autoComplete="email" />
                    <Button loading={isLoading} submit primary>Submit</Button>
                </FormLayout>
            </Form>

            {/* Error Message  */}
            <TextStyle variation="negative">{error}</TextStyle>
        </div>
    )
}

export default Home