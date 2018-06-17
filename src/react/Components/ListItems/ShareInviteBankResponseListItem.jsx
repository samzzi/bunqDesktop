import React from "react";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import TranslateButton from "../TranslationHelpers/Button";

import ShowOnly from "./ShareInviteBankTypes/ShowOnly";
import FullAccess from "./ShareInviteBankTypes/FullAccess";
import ParentChild from "./ShareInviteBankTypes/ParentChild";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    },
    buttons: {
        marginRight: 8
    }
};

class ShareInviteBankResponseListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    accept = event => {
        const { t, BunqJSClient, user, shareInviteBankResponse } = this.props;

        const success = t("The share request was successfully accepted");
        const failed = t("Failed to accept the share request");

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteBankResponse
                .put(user.id, shareInviteBankResponse.id, "ACCEPTED")
                .then(response => {
                    console.log(response);
                    this.setState({ loading: false });
                    this.props.openSnackbar(success);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ loading: false });
                    this.props.openSnackbar(failed);
                });
        }
    };

    reject = event => {
        const { t, BunqJSClient, user, shareInviteBankResponse } = this.props;

        const success = t("The share request was successfully cancelled");
        const failed = t("Failed to reject the share request");

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteBankResponse
                .put(user.id, shareInviteBankResponse.id, "CANCELLED")
                .then(response => {
                    console.log(response);
                    this.setState({ loading: false });
                    this.props.openSnackbar(success);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ loading: false });
                    this.props.openSnackbar(failed);
                });
        }
    };

    render() {
        const { t, shareInviteBankResponse } = this.props;

        let imageUUID = false;
        if (shareInviteBankResponse.counter_alias.avatar) {
            imageUUID =
                shareInviteBankResponse.counter_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = shareInviteBankResponse.counter_alias.display_name;

        const connectActions = (
            <React.Fragment>
                <TranslateButton
                    style={styles.buttons}
                    variant="raised"
                    color="primary"
                    onClick={this.accept}
                    disabled={this.state.loading}
                >
                    Accept
                </TranslateButton>
                <TranslateButton
                    style={styles.buttons}
                    variant="raised"
                    color="secondary"
                    onClick={this.reject}
                    disabled={this.state.loading}
                >
                    Reject
                </TranslateButton>
            </React.Fragment>
        );

        const shareDetailTypes = Object.keys(
            shareInviteBankResponse.share_detail
        );
        const shareDetailType = shareDetailTypes[0];

        let shareTypeObject = null;
        switch (shareDetailType) {
            case "ShareDetailPayment":
                shareTypeObject = (
                    <FullAccess t={t} secondaryActions={connectActions} />
                );
                break;
            case "ShareDetailDraftPayment":
                shareTypeObject = (
                    <ParentChild t={t} secondaryActions={connectActions} />
                );
                break;
            case "ShareDetailReadOnly":
                shareTypeObject = (
                    <ShowOnly t={t} secondaryActions={connectActions} />
                );
                break;
        }

        return [
            <ListItem
                button
                onClick={e => this.setState({ open: !this.state.open })}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText
                    primary={displayName}
                    secondary={t("Connect invite received")}
                />
                <ListItemSecondaryAction />
            </ListItem>,
            <Collapse in={this.state.open} unmountOnExit>
                {shareTypeObject}
            </Collapse>,
            <Divider />
        ];
    }
}

ShareInviteBankResponseListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

export default translate("translations")(ShareInviteBankResponseListItem);