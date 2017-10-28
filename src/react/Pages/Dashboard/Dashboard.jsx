import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import PaymentList from "./PaymentList";
import AccountList from "./AccountList";
import AccountQRCode from "../../Components/AccountQRCode";

import { userLogin, userLogout } from "../../Actions/user";

const styles = {
    btn: {
        width: "100%"
    }
};

class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidUpdate() {
        if (
            this.props.userType !== false &&
            this.props.userLoading === false &&
            this.props.usersLoading === false &&
            this.props.user === false
        ) {
            this.props.userLogin(this.props.userType);
        }
    }

    render() {
        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Dashboard`}</title>
                </Helmet>

                <Grid item xs={8} sm={10}>
                    <Typography type="title" gutterBottom>
                        Welcome {this.props.user.display_name}
                    </Typography>
                </Grid>

                <Grid item xs={4} sm={2}>
                    <Button style={styles.btn} onClick={this.props.logoutUser}>
                        Switch User
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper>
                        <AccountQRCode />
                        <PaymentList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading,
        usersLoading: state.users.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        logoutUser: () => dispatch(userLogout()),
        userLogin: (type, updated = false) =>
            dispatch(userLogin(BunqJSClient, type, updated))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
