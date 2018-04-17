package dk.opendesk.webscripts.node;

import dk.opendesk.repo.beans.NodeBean;
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
import java.util.ArrayList;
import java.util.Map;


public class PreProcessMove extends AbstractWebScript {

    private NodeBean nodeBean;

    public void setNodeBean(NodeBean nodeBean) {
        this.nodeBean = nodeBean;
    }

    @Override
    public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {

        Map<String, String> templateArgs = req.getServiceMatch().getTemplateVars();
        Content c = req.getContent();
        res.setContentEncoding("UTF-8");
        Writer webScriptWriter = res.getWriter();
        JSONArray result;

        try {
            JSONObject json = new JSONObject(c.getContent());
            ArrayList<String> nodeRefStrs = Utils.getJSONArray(json, "nodeRefs");
            ArrayList<NodeRef> nodeRefs = new ArrayList<>();
            for (String nodeRefStr : nodeRefStrs)
                nodeRefs.add(new NodeRef(nodeRefStr));

            String destinationRefStr = Utils.getJSONObject(json, "destinationRef");
            NodeRef destinationRef = new NodeRef(destinationRefStr);

            result = nodeBean.preProcessMove(nodeRefs, destinationRef);
        } catch (Exception e) {
            e.printStackTrace();
            result = Utils.getJSONError(e);
            res.setStatus(400);
        }
        Utils.writeJSONArray(webScriptWriter, result);
    }
}