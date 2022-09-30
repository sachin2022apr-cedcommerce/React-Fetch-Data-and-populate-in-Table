import { Button, Card, DataTable, Frame, Icon, List, Page, Pagination, Select, TextField, Loading }
    from '@shopify/polaris';

import React, { useCallback, useEffect, useState } from 'react'
import { LogOutMinor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
    // navigation for home
    var back = useNavigate()
    // states for active pages and rows per page
    var [activePage, setActivePage] = useState(1);
    var [rowPerPage, setRowPerPage] = useState(5);

    // user data state to store table data
    var [userData, setUserData] = useState([]);

    var [isLoading, setIsLoading] = useState(false)
    var [totalUsers, setTotalUsers] = useState(0);

    // colums for filter select 
    var [fillFilter, setFillFilter] = useState([
        { col: "user_id", filter: "", value: "1" },
        { col: "catalog", filter: "", value: "1" },
        { col: "username", filter: "", value: "1" },
        { col: "shops.email", filter: "", value: "1" },
        { col: "shopify_plan", filter: "", value: "1" },
        { col: "updated_at", filter: "", value: "1" },
        { col: "created_at", filter: "", value: "1" },
    ])
    // input box value for filter
    var [enterFilter, setEnterFilter] = useState([
        { filter: "" }, { filter: "" }, { filter: "" },
        { filter: "" }, { filter: "" }, { filter: "" }, { filter: "" },
    ])

    // logout function
    var logout = () => { sessionStorage.clear(); back('/'); }

    // if token is not available
    if (sessionStorage.getItem('token') === null) { back('/') }

    useEffect(() => {
        var str = "";
        // string creation for filter
        enterFilter.map((item, index) => {
            if (item.filter !== "") {
                str += "&filter[" + fillFilter[index].col + "][" + fillFilter[index].value + "]=" + item.filter + "";
            }
        })

        // abort for cancelling all previous requests
        if (window.controller) { window.controller.abort() }
        window.controller = new AbortController()
        var signal = window.controller.signal

        setIsLoading(true)
        // fetching data
        fetch(`https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${rowPerPage}+${str}`, {
            method: 'POST',
            signal: signal,
            headers: { Authorization: sessionStorage.getItem('token') }
        })
            .then((res) => res.json())
            .then((temp) => {
                var tempArr = [];
                if (temp.success) {
                    // getting total users in data
                    setTotalUsers(temp.data.count)
                    temp.data.rows.forEach((item, index) => {
                        tempArr.push([
                            item.user_id,
                            item.catalog,
                            item.username,
                            item.email,
                            item.shopify_plan,
                            item.updated_at,
                            item.created_at,]
                        )
                    });
                }
                setUserData(tempArr);
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [rowPerPage, activePage, enterFilter])

    // options for row per pages
    const options = [{ label: '5', value: "5" }, { label: '10', value: "10" },
    { label: '20', value: "20" }, { label: '30', value: "30" }];

    // options for filter
    const optionsFilter = [
        { label: "Equals", value: "1" },
        { label: "Not Equals", value: "2" },
        { label: "Contains", value: "3" },
        { label: "Does Not Contains", value: "4" },
        { label: "Starts With", value: "5" },
        { label: "Ends With", value: "6" },
    ];

    // change event for row per pages
    const handleSelectChange = useCallback((value) => setRowPerPage(value), []);

    // select tag for filter stores in - "selectMap"
    var selectMap = Array(fillFilter.length).fill(10).map((item, index) => {
        return <Select
            options={optionsFilter}
            onChange={(value) => {
                var tempChoice = fillFilter;
                tempChoice[index].value = value;
                setFillFilter([...tempChoice])
            }}
            value={fillFilter[index].value}
        />
    })

    // input fields for filter data
    var inputMap = Array(fillFilter.length).fill(10).map((item, index) => {
        return <TextField
            onChange={(value) => {
                var tempChoice = enterFilter;
                tempChoice[index].filter = value;
                setEnterFilter([...tempChoice])
            }}
            value={enterFilter[index].filter}
            placeholder={fillFilter[index].col}
            autoComplete="off"
        />
    })

    return (
        <div className='dashboard'>
            {/* dashboarsd options */}
            <div className='leftDiv'>
                <List>Dashboard</List>
                <List>Products</List>
                <List>Grid</List>
                <List><Button destructive onClick={logout}>
                    <Icon source={LogOutMinor} color="critical" />Logout</Button>
                </List>
            </div>
            {/* dashboard data */}
            <div className='rightDiv'>
                <Page>
                    <div className='header'>
                        <h1 className='dataGrid'>Data Grid....</h1>
                        <h1 className='dataGrid'>Showing form {((activePage - 1) * rowPerPage) + 1} to {((activePage - 1) * rowPerPage) + Number(rowPerPage)} of {totalUsers} users</h1>
                        <div className='headOperation'>
                            <Pagination
                                label={activePage}
                                hasPrevious={activePage > 1}
                                onPrevious={() => {
                                    setActivePage(activePage - 1)
                                }}
                                hasNext={activePage <= Math.ceil((totalUsers) / (rowPerPage))}
                                onNext={() => {
                                    setActivePage(activePage + 1)
                                }}
                            />
                            <Select label="Row per page" labelInline options={options}
                                onChange={handleSelectChange} value={rowPerPage} />
                            <Button primary>View Columns</Button>
                        </div>
                    </div>
                    {/* if data is loading */}
                    {(isLoading === true) ? <div style={{ height: '5px' }}>
                        <Frame> <Loading /> </Frame>
                    </div> : <></>}

                    {/* table for data display */}
                    <Card>
                        <DataTable
                            columnContentTypes={['text', 'numeric', 'text', 'text', 'text', 'text', 'text']}

                            headings={['UserId', 'Catalog', 'Shop domain', 'Shop email',
                                'Shop Plan Name', 'Updated at', 'Created at']}

                            rows={[selectMap, inputMap, ...userData]}
                        />
                    </Card>
                </Page>
            </div>
        </div>
    )
}

export default Dashboard