package dk.opendesk.webscripts.review;

import dk.opendesk.repo.beans.ReviewBean;
import dk.opendesk.repo.utils.Utils;
import org.alfresco.service.cmr.repository.NodeRef;
import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.springframework.extensions.surf.util.Content;
import org.springframework.extensions.webscripts.AbstractWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

import java.io.IOException;
import java.io.Writer;
import java.util.Map;


public class CreateReview extends AbstractWebScript {

    private ReviewBean reviewBean;

    public void setReviewBean(ReviewBean reviewBean) {
        this.reviewBean = reviewBean;
    }

    @Override
    public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {

        res.setContentEncoding("UTF-8");
        Content c = req.getContent();
        Writer webScriptWriter = res.getWriter();
        JSONArray result;

        try {
            JSONObject json = new JSONObject(c.getContent());
            String assignee = Utils.getJSONObject(json, "assignee");
            String message = Utils.getJSONObject(json, "message");
            String nodeId = Utils.getJSONObject(json, "nodeId");
            NodeRef nodeRef = new NodeRef("workspace://SpacesStore/" + nodeId);

            reviewBean.createReview(nodeRef, assignee, message);
            result = Utils.getJSONSuccess();
        } catch (Exception e) {
            e.printStackTrace();
            result = Utils.getJSONError(e);
            res.setStatus(400);
        }
        Utils.writeJSONArray(webScriptWriter, result);
    }
}