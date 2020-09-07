import React, { useEffect, useRef, useState, useContext } from "react";
import "./DropdownMenu.scss";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PropTypes from "prop-types";
import Portal from "HOC/Portal";
import { UserContext } from "context/UserContext";
import useWindowSize from "Hooks/useWindowSize";

const DropdownMenu = ({ classes, children, anchorEl, offset, onClickClose, scrollableAt }) => {
	const [width] = useWindowSize();
	const [cords, setCords] = useState({});
	const [show, setShow] = useState(false);
	const offsetRef = useRef(offset);
	const [{ theme }] = useContext(UserContext);

	useEffect(() => {
		const dropDownMenuAnchorElement = anchorEl.current;

		const openMenu = () => {
			const rect = anchorEl.current.getBoundingClientRect();
			setCords({
				left: rect.x + rect.width + offsetRef.current.x,
				top: rect.y + window.scrollY + offsetRef.current.y,
			});
			setShow(true);
		};

		dropDownMenuAnchorElement.addEventListener("click", openMenu);

		setShow(false);
		return () => {
			dropDownMenuAnchorElement.removeEventListener("click", openMenu);
		};
	}, [width, anchorEl]);

	const closeMenuClickHandler = () => {
		setShow(false);
	};

	if (show) {
		return (
			<Portal mountTo="root-menu">
				<ClickAwayListener onClickAway={closeMenuClickHandler}>
					<div
						style={{ top: cords.top, left: cords.left, maxHeight: scrollableAt }}
						className={`drop-down-menu ${!!scrollableAt ? "scrollable" : ""} ${
							theme ? "theme-light" : "theme-dark"
						} ${classes.join(" ")}`}
					>
						{Array.isArray(children) ? (
							children
								.filter((node) => node)
								.map((node) => (
									<div
										onClick={onClickClose ? closeMenuClickHandler : undefined}
										key={"" + Math.random()}
										className="drop-down-menu-item"
									>
										{node}
									</div>
								))
						) : (
							<div className="drop-down-menu-item">{children}</div>
						)}
					</div>
				</ClickAwayListener>
			</Portal>
		);
	} else {
		return null;
	}
};

DropdownMenu.defaultProps = {
	classes: [""],
	offset: { x: 0, y: 0 },
	onClickClose: true,
	scrollableAt: undefined,
};

DropdownMenu.propTypes = {
	classes: PropTypes.arrayOf(PropTypes.string),
	children: PropTypes.node.isRequired,
	offset: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
	onClickClose: PropTypes.bool,
	scrollableAt: PropTypes.number,
};

export default DropdownMenu;