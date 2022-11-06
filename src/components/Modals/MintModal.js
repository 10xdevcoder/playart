import Modal from "react-bootstrap/Modal";
import "./MintModal.css";

export default function MintModal(props) {
  return (
    <Modal
      {...props}
      //size={props.size}
      dialogClassName={props.widthclassname}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}
