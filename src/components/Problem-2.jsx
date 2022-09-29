import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");
const Problem2 = () => {
  const location = useLocation();
  let timeOutID;
  const contactListRef = useRef(null);
  const [modal, setModal] = useState(() => {
    let whichModalToOpen = location.pathname.includes("all-contacts")
      ? "a"
      : location.pathname.includes("us-contacts")
      ? "b"
      : "";
    return whichModalToOpen;
  });

  const [endpoint, setEndpoint] = useState("contacts");

  // used for controlled input
  const [search, setSearch] = useState("");

  // used for delayed search
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);

  const [nextPageURL, setNextPageURL] = useState(null);

  const [showEvenOnly, setShowEvenOnly] = useState(false);

  const [contacts, setContacts] = useState([]);

  const [modalCDetails, setModalCDetails] = useState({});

  const handleOnScroll = () => {
    if (contactListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contactListRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        // reached the bottom of the div
        // so set the page to the next page url
        if (nextPageURL) {
          let url = new URL(nextPageURL);
          let page = url.searchParams.get("page");
          setPage(page);
        }
      }
    }
  };

  const handleSearchOnChange = (e) => {
    setSearch(e.target.value);
    clearTimeout(timeOutID);
    timeOutID = setTimeout(() => {
      setQuery(e.target.value);
    }, 700);
  };

  const handleSearchOnKeyDown = (e) => {
    if (e.key == "Enter") {
      clearTimeout(timeOutID);
      setQuery(search);
    }
  };

  const closeModal = () => {
    setModal("");
  };

  const handleModalChange = (modal, modalCDetails = {}) => {
    setModal(modal);
    if (modal == "b") {
      setEndpoint("country-contacts/United%20States");
    } else if (modal == "a") {
      setEndpoint("contacts");
    }
    setSearch("");
    setQuery("");
    setPage(1);
    setModalCDetails(modalCDetails);
  };

  useEffect(() => {
    async function getContacts() {
      let searchTerm = ``;
      if (query.length > 0) {
        searchTerm = `&search=${query}`;
      }
      let fetchURL = `https://contact.mediusware.com/api/${endpoint}/?page=${page}${searchTerm}`;
      const res = await fetch(fetchURL);
      const resJson = await res.json();
      if (resJson?.results) {
        if (page > 1) {
          setContacts((prevContacts) => {
            return [...prevContacts, ...resJson.results];
          });
        } else {
          setContacts(resJson.results);
        }
      }
      setNextPageURL(resJson.next);
    }

    getContacts();
  }, [query, endpoint, page]);
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => handleModalChange("a")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => handleModalChange("b")}
          >
            US Contacts
          </button>
        </div>
      </div>
      <div>
        <Modal
          isOpen={modal != ""}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="row justify-content-center mt-5">
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-lg"
                type="button"
                style={{
                  color: "#46139f",
                }}
                onClick={() => handleModalChange("a")}
              >
                All Contacts
              </button>
              <button
                className="btn btn-lg"
                type="button"
                style={{
                  color: "#ff7f50",
                  background: "white",
                }}
                onClick={() => handleModalChange("b")}
              >
                US Contacts
              </button>
              <button
                className="btn btn-lg"
                type="button"
                style={{
                  color: "black",
                  border: "1px solid #46139f",
                }}
                onClick={() => handleModalChange("")}
              >
                Close
              </button>
            </div>
          </div>
          <h4 className="text-center text-uppercase mb-5">
            {modal == "a"
              ? "All Contacts"
              : modal == "b"
              ? "US Contacts"
              : null}
          </h4>
          {(modal == "a" || modal == "b") && (
            <div className="mt-2">
              <input
                type="checkbox"
                name="showEven"
                checked={showEvenOnly}
                value={showEvenOnly}
                onChange={(e) => setShowEvenOnly((prev) => !prev)}
              />
              <label htmlFor="showEven">Show Only Even Id'd contacts</label>
            </div>
          )}
          {(modal == "a" || modal == "b") && (
            <div className="mt-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={handleSearchOnChange}
                onKeyDown={handleSearchOnKeyDown}
              />
            </div>
          )}
          <div
            className="contact-list-wrapper"
            ref={contactListRef}
            onScroll={handleOnScroll}
          >
            {(modal == "a" || modal == "b") &&
              contacts
                .filter((contact) => {
                  if (showEvenOnly) {
                    return contact.id % 2 == 0;
                  }
                  return true;
                })
                .map((contact, idx) => {
                  return (
                    <div
                      key={`${contact.phone}${idx}`}
                      onClick={() => handleModalChange("c", contact)}
                    >
                      {contact.phone}
                    </div>
                  );
                })}
          </div>
        </Modal>
        <Modal
          isOpen={modal == "c"}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="row justify-content-center mt-5">
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-lg"
                type="button"
                style={{
                  color: "black",
                  border: "1px solid #46139f",
                }}
                onClick={() => handleModalChange("")}
              >
                Close
              </button>
            </div>
          </div>
          <h4 className="text-center text-uppercase mb-5">Modal C</h4>
          <div>
            <div>{modalCDetails?.phone}</div>
            <div>{modalCDetails?.country?.name}</div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Problem2;
